import { IReactForQuill, RFQValue } from '@src/Models/index.model';
import Quill, { QuillOptions, Parchment } from 'quill';
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Delta, EmitterSource } from 'quill/core';

import { CUSTOM_MODULES } from './Modules';
import customModules from './Modules';
const { Mention, MentionBlot } = customModules;

Quill.register({
  [`formats/${CUSTOM_MODULES.MENTION_BLOT}`]: MentionBlot,
  [`modules/${CUSTOM_MODULES.MENTION}`]: Mention
}, true);

const ReactForQuill = forwardRef((props: IReactForQuill, ref:  React.MutableRefObject<Quill>) => {
  const { readOnly, value, className, style, onKeyUp, onChange, onQuillEventChange, onBlur, onDoubleClick } = props;
  const quillRef = useRef<Quill | null>(ref?.current ?? null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onTextChangeRef = useRef(onChange);
  const onQuillEventChangeRef = useRef(onQuillEventChange);
  const onDoubleClickRef = useRef(onDoubleClick);
  const [loading, setLoading] = useState(true);

  const onKeyUpRef = useRef(onKeyUp);
  const onBlurRef = useRef(onBlur);

  useLayoutEffect(() => {
    onTextChangeRef.current = onChange;
    onQuillEventChangeRef.current = onQuillEventChange;
    onKeyUpRef.current = onKeyUp;
    onBlurRef.current = onBlur;
    onDoubleClickRef.current = onDoubleClick;
  });

  useEffect(() => {
    if (ref) ref.current = quillRef.current;
  });

  useEffect(() => {
    quillRef.current?.enable(!readOnly);
  }, [readOnly]);

  const initValue =  (value: RFQValue, quill?: Quill) => {
    if (!quill || loading) return;
    let newDelta;
    const currentDelta = quill.getContents(0, quill.getLength() - 1);
    let cursorIndex = 0;
    if (typeof value === 'string') {
      newDelta = quill.clipboard.convert({ html: value });
    } else if (value instanceof Delta) {
      newDelta = value;
    }
    if (!newDelta) {
      console.error('Invalid value type');
      return;
    }
    const diff = currentDelta.diff(newDelta);
    if (diff.ops.length === 0) return;
    cursorIndex = newDelta.ops.reduce((acc, item) => {
      if (typeof item.insert === 'string') {
        acc += item.insert.length;
      } else if (item.insert) {
        acc += 1;
      }
      return acc;
    }, 0);
    quill.setContents(newDelta, 'silent');
    quill.setSelection(cursorIndex, 'silent');
  };
  useEffect(() => {
    initValue(value, quillRef.current);
  }, [loading, value]);

  const handleDoubleClick = (e: MouseEvent) => {
    const node = e?.target;
    if (!node || !quillRef.current) return;
    const blot = Quill.find(node as Node) as Parchment.Blot;
    if (!blot) return;
    const index = quillRef.current.getIndex(blot);
    const length = blot.length ? blot.length() : 1;
    const delta = quillRef.current.getContents(index, length);
    onDoubleClickRef.current?.(delta);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const editorBox = container.ownerDocument.createElement('div');

      editorBox.onkeyup = (e: any) => {
        onKeyUpRef.current?.(e);
      };

      const editorContainer = container.appendChild(editorBox);
      const { theme, debug, registry, bounds, modules, formats } = props;
      const quillOptions: QuillOptions = { theme, debug, registry, bounds, modules, formats };

      const quill = new Quill(editorContainer, quillOptions);
      quill.on(Quill.events.TEXT_CHANGE, (delta: Delta, oldContent: Delta, source: EmitterSource) => {
        const html = quill.getSemanticHTML();
        onTextChangeRef.current?.(html, delta, oldContent, source);
      });
      Object.keys(Quill.events).forEach((key) => {
        if (key === Quill.events.TEXT_CHANGE && typeof onTextChangeRef.current === 'function') return;
        quill.on(key, (...args: unknown[]) => {
          onQuillEventChangeRef.current?.(key as keyof typeof Quill.events, ...args);
        });
      });
      quill.root.addEventListener('dblclick', handleDoubleClick);
      quill.root.addEventListener('blur', (e) => onBlurRef.current?.(e));

      quillRef.current = quill;
      setLoading(false);
    }
    return () => {
      quillRef.current = null;
      if (container) container.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className={`rfq-container ${className ?? ''}`} style={style} />;
});

export { customModules };
export * from './Modules';
export * as Models from '@src/Models/index.model';
export default ReactForQuill;
