ReactForQuill [![npm](https://img.shields.io/npm/v/react-for-quill.svg)](https://www.npmjs.com/package/react-for-quill)
[![npm downloads](https://img.shields.io/npm/dt/react-for-quill.svg?maxAge=2592000)](http://www.npmtrends.com/react-for-quill)
==============================================================================

A [Quill] component for [React].
It is based on bun, quill@2 and react@18 

[quill]: https://quilljs.com
[react]: https://facebook.github.io/react/

- [Quick Start](#quick-start)
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

## License

The MIT License (MIT)
Copyright (c) 2024 Duc-Developer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.