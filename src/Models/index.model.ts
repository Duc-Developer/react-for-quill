import Quill, { EmitterSource } from 'quill';
import { Delta, QuillOptions } from 'quill/core';
import { MentionOption } from '@src/Modules/Mention';

export type RFQValue = string | Delta;
export type RFQEventChange = (event: keyof typeof Quill.events, ...args: unknown[]) => void;
export type RFQOnChange = (html: string, delta: Delta, oldContent: Delta, source: EmitterSource) => void;
export type RFQModules = Record<string, unknown> & Partial<Record<string, string>>;

export { MentionOption };
export interface IReactForQuill extends QuillOptions {
  theme: string;
  readOnly?: boolean;
  defaultValue?: RFQValue;
  style?: React.CSSProperties;
  onChange?: RFQOnChange;
  onBlur?: (e: FocusEvent) => void;
  onDoubleClick?: (delta: Delta) => void;
  onKeyUp?: (e: KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
  onQuillEventChange?: RFQEventChange;
  modules?: RFQModules;
}
