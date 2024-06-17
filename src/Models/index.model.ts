import Quill, { EmitterSource } from 'quill';
import { Delta, QuillOptions } from 'quill/core';

export type RFQValue = string | Delta;
export type RFQEventChange = (event: keyof typeof Quill.events, ...args: unknown[]) => void;
export type RFQOnChange = (html: string, delta: Delta, oldContent: Delta, source: EmitterSource) => void;
export interface IReactForQuill {
  theme: string;
  readOnly?: boolean;
  value?: RFQValue;
  style?: React.CSSProperties;
  onChange?: RFQOnChange;
  onBlur?: (e: FocusEvent) => void;
  onDoubleClick?: (delta: Delta) => void;
  options?: QuillOptions;
  onKeyUp?: (e: KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
  onQuillEventChange?: RFQEventChange;
}
