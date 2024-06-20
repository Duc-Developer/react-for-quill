import DOMPurify from 'dompurify';
import Quill from 'quill';
import { Delta, EmitterSource, Module } from 'quill/core';

import { CUSTOM_MODULES } from '.';

const Loader = `<div class='mention-loader'></div>`;
const DEFAULT_SUGGEST_KEY = '@';
export interface ISuggestItem {
    label: string;
    value: string;
    [key: string]: any;
}
export interface MentionModuleOptions {
    getSuggestions: (query: string) => Promise<ISuggestItem[]>;
    mentioned?: (op: ISuggestItem) => void;
    suggestKey?: string;
    style?: Record<string, string>;
}
export default class Mention {
    isOpen: boolean;
    options: MentionModuleOptions = { suggestKey: DEFAULT_SUGGEST_KEY, getSuggestions: async () => [] };
    quill: Quill;
    popover?: HTMLElement;
    private _selectedSuggestion: number = -1;

    constructor(quill: Quill, options: MentionModuleOptions) {
        this.quill = quill;
        if (options) this.options = { ...this.options, ...options };
        this.isOpen = false;

        if (!this.isValidOption(options)) return;

        if (!this.quill) return;

        this.onTextChange = this.onTextChange.bind(this);

        this.quill.on(Quill.events.TEXT_CHANGE, this.onTextChange);
        this.setupMentionDropdownNavigation();
    }

    isValidOption(options: MentionModuleOptions) {
        const valid = options?.getSuggestions;
        if (!valid) console.warn('%c Mention module required configured with getSuggestions function', 'font-size:14px;color:red');
        return valid;
    }

    onTextChange(delta: Delta, oldContent: Delta, source: EmitterSource) {
        if (source !== 'user') return;

        const newCharacters = delta.ops
            .filter((op) => op.insert)
            .map((op) => op.insert)
            .join('');
        if (newCharacters?.includes('\n')) {
            this.closeSuggestionPopover();
            return;
        }

        const isDeletingMention = this.onDeleteMention(delta);
        if (isDeletingMention) return;

        const mentionData = this.getTextAfterMention();

        if (!mentionData) {
            this.closeSuggestionPopover();
        } else {
            const { text, index } = mentionData;
            this.isOpen = true;
            this.openSuggestionPopover(text, index);
        }
    }

    getTextAfterMention(): { text: string; index: number } | null {
        const result = { text: '', index: -1 };
        const { suggestKey } = this.options;
        const cursorPosition = this.quill?.getSelection()?.index;
        if (typeof cursorPosition !== 'number') return null;
        const delta = this.quill.getContents(0, cursorPosition);
        
        const matchedIndex = delta.ops.findLastIndex((op) => {
            const isMentioned = op?.attributes && Boolean(CUSTOM_MODULES.MENTION_BLOT in op.attributes);
            const matched = typeof op?.insert === 'string' && op.insert.includes(suggestKey) && !isMentioned;
            return matched;
        });
        const hasMention = delta.ops[matchedIndex];
        if (typeof hasMention?.insert !== 'string') return null;

        // calculate mention query
        const index = hasMention.insert.lastIndexOf(suggestKey);
        const textBeforeCursor = hasMention.insert.slice(index + 1);
        result.text = textBeforeCursor;

        // calculate index of mention query
        result.index = delta.ops.slice(0, matchedIndex + 1).reduce((acc, op, i) => {
            if (matchedIndex === i) return acc + index;
            if (typeof op.insert === 'string') return acc + op.insert.length;
            if (op.insert instanceof Module) return acc + 1;
            return acc;
        }, 0);
        console.log(result);
        return result;
    }

    onDeleteMention(delta: Delta) {
        const ops = delta.ops;
        const index = ops[0]?.retain;
        if (typeof index !== 'number') return;
        const deletedLength = ops[1]?.delete;
        if (typeof deletedLength !== 'number') return;

        const contentBeforeDeletion = this.quill.getContents(0, index);
        const lastOp = contentBeforeDeletion.ops[contentBeforeDeletion.ops.length - 1];

        const isDeletingMention = lastOp.insert && lastOp.attributes && lastOp.attributes?.[CUSTOM_MODULES.MENTION_BLOT];
        if (isDeletingMention) {
            const mentionLength = typeof lastOp.insert === 'string' ? lastOp.insert.length : 1;

            const deleteMentionDelta = new Delta().retain(index - mentionLength).delete(mentionLength + deletedLength);

            this.quill.updateContents(deleteMentionDelta, 'user');
        }
        return isDeletingMention;
    }

    getEditorContainer(): HTMLElement {
        return this.quill.container;
    }

    handleOutsideClick(event: MouseEvent) {
        if (this.popover && !this.popover.contains(event.target as Node)) {
            this.closeSuggestionPopover();
        }
    }

    async openSuggestionPopover(query: string, start: number) {
        if (!this.options?.getSuggestions || !this.isOpen) return;
        const { getSuggestions } = this.options;

        if (!this.popover) {
            this.popover = document.createElement('div');
            this.popover.className = 'popover-tooltip';
            this.getEditorContainer()?.appendChild(this.popover);
            // Improved focus out handling
            this.popover.addEventListener('focusout', (event) => {
                setTimeout(() => {
                    // Delay to allow focus to move
                    if (!this.popover?.contains(document.activeElement)) {
                        this.closeSuggestionPopover();
                    }
                }, 0);
            });

            // Handle clicks outside the popover
            document.addEventListener('click', this.handleOutsideClick.bind(this), true);
        }

        const selection = this.quill?.getSelection()?.index;
        if (!selection && selection !== 0) return;
        const cursorPosition = this.quill?.getBounds(selection);
        if (!cursorPosition) return;
        this.popover.style.top = `${cursorPosition.bottom}px`;
        this.popover.style.left = `${cursorPosition.left}px`;

        this.popover.innerHTML = DOMPurify.sanitize(`<div class='flex justify-center'>${Loader}</div>`);
        const suggestions = await getSuggestions(query);

        if (!suggestions.length) {
            this.popover.innerHTML = DOMPurify.sanitize(`<div class='no-data'>NoData</div>`);
            return;
        }
        this._selectedSuggestion = 0; // init selected when searching

        const content = suggestions
            .map((item, i) => {
                const userId = item.value;
                const userName = item.label;
                return `<div class='mention-item ${i === 0 ? 'highlight' : ''}' title='${userName}' data-user-id='${userId}' data-user-name='${userName}'>${userName}</div>`;
            })
            .join('');
        this.popover.innerHTML = DOMPurify.sanitize(content);

        this.popover.querySelectorAll('.mention-item').forEach((item) => {
            item.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const { userId } = target?.dataset ?? {};
                if (!userId) return;
                const user = suggestions.find((s) => {
                    if (typeof s.value !== 'number' && !s.value) return false;
                    return s.value.toString() === userId;
                });
                if (!user) return;
                this.insertMention(user, start, query.length);
            });
        });
    }

    insertMention(user: ISuggestItem, start: number, range: number) {
        const { suggestKey, mentioned, style } = this.options;
        const { label: name, value: id } = user;
        this.closeSuggestionPopover();
        this.quill.deleteText(start, range + 1);
        const deltaAtPosition = new Delta()
            .retain(start)
            .insert(`${suggestKey}${name}`, { [CUSTOM_MODULES.MENTION_BLOT]: { id, style } })
            .insert('\u200B');
        this.quill.updateContents(deltaAtPosition);
        this.quill.setSelection(start + name.length + 2);
        mentioned?.(user);
    }

    setupMentionDropdownNavigation() {
        this.getEditorContainer()?.addEventListener('keydown', this.handleKeyDown.bind(this), true);
    }

    handleKeyDown(event: KeyboardEvent) {
        if (!this.popover) return;
        const items = this.popover.querySelectorAll('.mention-item');
        if (items.length === 0) return;
        let next = this._selectedSuggestion;
        switch (event.key) {
            case 'ArrowDown':
                next = next + 1;
                this._selectedSuggestion = next > items.length - 1 ? 0 : next;
                event.preventDefault();
                break;
            case 'ArrowUp':
                next = next - 1;
                this._selectedSuggestion = next < 0 ? items.length - 1 : next;
                event.preventDefault();
                break;
            case 'Enter':
                const currentSelectedItem = items[this._selectedSuggestion] as HTMLElement;
                if (!currentSelectedItem) {
                    this.closeSuggestionPopover();
                    break;
                }
                currentSelectedItem.click();
                event.preventDefault();
                event.stopPropagation();
                break;
            case 'Escape':
                event.preventDefault();
                event.stopPropagation();
                this.closeSuggestionPopover();
                break;
            case 'ArrowRight':
            case 'ArrowLeft':
                event.preventDefault();
                break;
            default:
                break;
        }
        this.highlightSelectedItem(items);
    }

    highlightSelectedItem(items: NodeListOf<Element>) {
        items.forEach((item) => item.classList.remove('highlight'));
        const selectedItem = items[this._selectedSuggestion];
        if (selectedItem) {
            selectedItem.classList.add('highlight');
            selectedItem.scrollIntoView({ block: 'nearest', inline: 'start' });
        }
    }

    closeSuggestionPopover() {
        this.isOpen = false;
        if (this.popover) {
            this.popover.remove();
            this.popover = undefined;
            document.removeEventListener('click', this.handleOutsideClick.bind(this), true);
        }
        this._selectedSuggestion = -1;
        this.getEditorContainer().removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
}
