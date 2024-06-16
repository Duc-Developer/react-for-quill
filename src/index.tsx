import { IReactForQuill } from '@src/Models/index.model';
import Quill, { QuillOptions, Parchment } from 'quill';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import './index.css';
import { Delta, EmitterSource, Op } from 'quill/core';

function isOp(obj: any): obj is Op {
  return 'insert' in obj || 'delete' in obj || 'retain' in obj || 'attributes' in obj;
}
const ReactForQuill = (props: IReactForQuill, ref: any) => {
  const { readOnly, value, className, style, theme, placeholder, options, onKeyUp, onChange, onQuillEventChange, onBlur, onDoubleClick } = props;
  const quillRef = useRef<Quill | null>(ref);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const valueRef = useRef(value);
  const onTextChangeRef = useRef(onChange);
  const onQuillEventChangeRef = useRef(onQuillEventChange);
  const onDoubleClickRef = useRef(onDoubleClick);

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
  }, [quillRef.current, readOnly]);

  useEffect(() => {
    // if (valueRef.current === value || !quillRef.current) return;
    // let newValue = value;
    // let cursorIndex = 0;
    // if (!newValue) newValue = '';
    // if (typeof newValue === 'string') {
    //     cursorIndex = newValue.length;
    //     newValue = quillRef.current.clipboard.convert({ html: newValue });
    // }
    // if (!(newValue instanceof Delta) || !newValue.ops.every(isOp)) return;
    // if(typeof newValue.length === 'function')  cursorIndex =  newValue.length();
    // valueRef.current = newValue;
    // quillRef.current.setContents(newValue, 'silent');
    // quillRef.current.setSelection(cursorIndex, 'silent');
  }, [quillRef.current, value]);

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
      const quillOptions: QuillOptions = { theme, placeholder, ...options };

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
    }
    return () => {
      quillRef.current = null;
      if (container) container.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className={`rfq-container ${className ?? ''}`} style={style} />;
};

export * as Models from '@src/Models/index.model';
export default forwardRef(ReactForQuill);
