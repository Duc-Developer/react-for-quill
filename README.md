ReactForQuill [![npm](https://img.shields.io/npm/v/react-for-quill.svg)](https://www.npmjs.com/package/react-for-quill)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/Duc-Developer/react-for-quill/release.yml)](https://github.com/Duc-Developer/react-for-quill/actions/workflows/release.yml)
[![release](https://img.shields.io/github/release-date/Duc-Developer/react-for-quill?display_date=published_at)](https://github.com/Duc-Developer/react-for-quill/releases)
[![NPM Downloads](https://img.shields.io/npm/d18m/react-for-quill)](http://www.npmtrends.com/react-for-quill)
==============================================================================

![react-for-quill-logo](/assets/logo.png)


A [Quill] component for [React].

It is based on bun & quill v2

See [live demo]

[quill]: https://quilljs.com
[react]: https://facebook.github.io/react/
[live demo]: https://duc-developer.github.io/react-for-quill

- [Quick Start](#quick-start)
  - [Prepare Assets](#prepare-assets)
  - [Basic Usage](#basic-usage)
- [License](#license)

## Quick Start

Make sure you have `react` and `react-dom`

With CDN:
```html
<head>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-for-quill@1.0.3/dist/index.esm.js"></script>

  <link href="https://cdn.jsdelivr.net/npm/react-for-quill@1.0.3/dist/quill.snow.css" rel="stylesheet" />
</head>
<body>
  <div id='root'></div>
</body>
```

---

With NPM:
```sh
npm install react-for-quill --save
```

### Prepare Assets
Embed your theme's source of quill which u want use.
Root assets from [quill-theme](https://quilljs.com/docs/customization/themes#themes)

Choose your theme what you want `snow` or `bubble`, embed style to root html.

```html
<link href="https://cdn.jsdelivr.net/npm/react-for-quill@1.0.3/dist/quill.snow.css" rel="stylesheet" />
```
or
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/react-for-quill@1.0.3/dist/quill.bubble.css" />
```

---

### Basic Usage

Implement your code
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
        theme='snow' // or bubble
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
