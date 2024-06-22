import Quill from 'quill';

const Inline: any = Quill.import('blots/inline');

export default class MentionBlot extends Inline {
  blotName = 'mentionBlot';
  tagName = 'span';
  static create(attributes: { id: string, style: Record<string, string> }) {
    const { id, style } = attributes;
    const node = super.create();
    node.setAttribute('data-user-id', id);
    node.setAttribute('quill-type', 'mention');
    if (style) node.style = Object.keys(style).map((key) => `${key}: ${style[key]}`).join(';');

    // Make the content non-editable
    node.setAttribute('contenteditable', 'false');
    node.className = 'mention-blot select-none';
    return node;
  }

  static formats(node: HTMLElement) {
    return {
      id: node.getAttribute('data-user-id'),
      type: node.getAttribute('quill-type')
    };
  }

  static value(node: HTMLElement): { userId: string | null; type: string | null; } {
    return {
      userId: node.getAttribute('data-user-id'),
      type: node.getAttribute('quill-type')
    };
  }

  format(name: string, value: any) {
    if (name === 'userId' && value) {
      this.domNode.setAttribute('data-user-id', value);
    } else if (name === 'type' && value) {
      this.domNode.setAttribute('type', value);
    } else super.format(name, value);
  }
}

// required init for custom blots
MentionBlot.blotName = 'mentionBlot';
MentionBlot.tagName = 'span';