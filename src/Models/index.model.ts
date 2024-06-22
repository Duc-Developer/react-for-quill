import { CustomModuleKey, MentionModuleOptions } from '../Modules';
import Quill, { EmitterSource } from 'quill';
import { Delta, QuillOptions, Module } from 'quill/core';

export type RFQValue = string | Delta;
export type RFQEventChange = (event: keyof typeof Quill.events, ...args: unknown[]) => void;
export type RFQOnChange = (html: string, delta: Delta, oldContent: Delta, source: EmitterSource) => void;
export type RFQModules = Record<string, unknown> & Partial<Record<CustomModuleKey, MentionModuleOptions>>;
export interface IReactForQuill extends QuillOptions {
  theme: string;
  readOnly?: boolean;
  value?: RFQValue;
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
