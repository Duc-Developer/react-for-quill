import { IReactForQuill, RFQValue } from '@models/index.model';
import Quill, { QuillOptions, Parchment } from 'quill';
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Delta, EmitterSource } from 'quill/core';

const ReactForQuill = forwardRef((props: IReactForQuill, ref: React.MutableRefObject<Quill>) => {
  const { readOnly, defaultValue, className, style, onKeyUp, onChange, onQuillEventChange, onBlur, onDoubleClick } = props;
  const quillRef = useRef<Quill | null>(ref?.current ?? null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onTextChangeRef = useRef(onChange);
  const onQuillEventChangeRef = useRef(onQuillEventChange);
  const onDoubleClickRef = useRef(onDoubleClick);
  const defaultValueRef = useRef();
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

  const initValue = (defaultValue: RFQValue, quill?: Quill) => {
    if (!quill || loading || defaultValueRef.current === defaultValue) return;
    if (typeof defaultValue === 'string') {
      quill.clipboard.dangerouslyPasteHTML(defaultValue, 'api');
      return;
    } else if (defaultValue instanceof Delta) {
      const newDelta = defaultValue;
      quill.setContents(newDelta, 'api');
    }
  };
  useEffect(() => {
    if (defaultValue === undefined) return;
    initValue(defaultValue, quillRef.current);
  }, [loading, defaultValue]);

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

export default ReactForQuill;
