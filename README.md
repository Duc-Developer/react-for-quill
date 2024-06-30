[![NPM Version](https://img.shields.io/npm/v/react-for-quill?labelColor=%23C12127)](https://www.npmjs.com/package/react-for-quill)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/Duc-Developer/react-for-quill/release.yml)](https://github.com/Duc-Developer/react-for-quill/actions/workflows/release.yml)
[![release](https://img.shields.io/github/release-date/Duc-Developer/react-for-quill?display_date=published_at)](https://github.com/Duc-Developer/react-for-quill/releases)
[![NPM Downloads](https://img.shields.io/npm/d18m/react-for-quill)](http://www.npmtrends.com/react-for-quill)
[![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/Duc-Developer/react-for-quill)](https://github.com/Duc-Developer/react-for-quill/issues)
==============================================================================

![react-for-quill-logo](/assets/logo.png)


A [Quill] component for [React].

It is based on bun & quill v2

See [live demo] or [code pen]

[quill]: https://quilljs.com
[react]: https://facebook.github.io/react/
[live demo]: https://duc-developer.github.io/react-for-quill
[code pen]: https://codepen.io/Duc-Developer/pen/LYovqVL

- [](#)
  - [Quick Start](#quick-start)
    - [Prepare Assets](#prepare-assets)
    - [Basic Usage](#basic-usage)
  - [Contributing](#contributing)

## Quick Start

Make sure you have `react` and `react-dom`

With NPM:
```sh
npm install react-for-quill --save
```

### Prepare Assets
Embed your theme's source of quill which u want use.
Root assets from [quill-theme](https://quilljs.com/docs/customization/themes#themes)

Choose your theme what you want `snow` or `bubble`, embed style to root html.

```html
<link href="https://cdn.jsdelivr.net/npm/react-for-quill@1.0.4/dist/quill.snow.css" rel="stylesheet" />
```
or
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/react-for-quill@1.0.4/dist/quill.bubble.css" />
```

---

### Basic Usage

Implement your code
```jsx
import React, { useState } from 'react';
import ReactQuill from 'react-for-quill';
import 'react-quill/dist/quill.snow.css';

const defaultValue = '<p>Hello World!<p>';
function MyComponent() {
  const [initialValue, setInitialValue] = useState<RFQValue>(defaultValue);
  const [value, setValue] = useState<RFQValue>(initialValue);
  const onChange = (html: string, delta: Delta, oldContent: Delta, source: EmitterSource) => {
    setValue(html);
  };
  return (
    <>
      <ReactForQuill
        style={{ width: 500, height: 500 }}
        theme='snow' // or bubble
        defaultValue={initialValue}
        onChange={onChange}
      />
    </>
  );
}
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/Duc-Developer/react-for-quill. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](/CODE_OF_CONDUCT.md) code of conduct.

If you wish to contribute, see [CONTRIBUTING](/CONTRIBUTING.md) for development instructions and check out our pinned
[roadmap issue](https://github.com/Duc-Developer/react-for-quill/issues) for a list of tasks to get started.
