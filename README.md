ReactForQuill
==============================================================================

---

A [Quill] component for [React].
It is based on bun and react@17 

---

[quill]: https://quilljs.com
[react]: https://facebook.github.io/react/

- [Quick Start](#quick-start)
- [Contributors](#contributors)
- [License](#license)

## Quick Start

Make sure you have `react` and `react-dom`

```sh
npm install react-for-quill --save
```

Embed your theme's source of quill which u want use. Docs [quill-theme](https://quilljs.com/docs/customization/themes#themes)

```html
<!-- At root index.html -->
 <!-- snow theme -->
<link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet" />
 <!-- bubble theme -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.bubble.css" />
```

```jsx
import React, { useState } from 'react';
import ReactQuill from 'react-for-quill';
import 'react-quill/dist/quill.snow.css';

function MyComponent() {
 const [value, setValue] = useState<RFQValue>('');
  const onChange = (html: string, delta: Delta, oldContent: Delta, source: EmitterSource) => {
    setValue(html);
  };
  return (
    <>
      <ReactForQuill
        style={{ width: 500, height: 500 }}
        theme='snow'
        value={value}
        onChange={onChange}
      />
    </>
  );
}
```