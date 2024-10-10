[![NPM Version](https://img.shields.io/npm/v/react-for-quill?labelColor=%23C12127)](https://www.npmjs.com/package/react-for-quill)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/Duc-Developer/react-for-quill/release.yml)](https://github.com/Duc-Developer/react-for-quill/actions/workflows/release.yml)
[![release](https://img.shields.io/github/release-date/Duc-Developer/react-for-quill?display_date=published_at)](https://github.com/Duc-Developer/react-for-quill/releases)
[![NPM Downloads](https://img.shields.io/npm/d18m/react-for-quill)](http://www.npmtrends.com/react-for-quill)
[![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/Duc-Developer/react-for-quill)](https://github.com/Duc-Developer/react-for-quill/issues)
==============================================================================

![react-for-quill-logo](/assets/logo.png)


A [Quill] component for [React]. It's faster, friendly and supports many features. Data will be cleaned with [domify](https://www.npmjs.com/package/domify) ([xss-attach](https://owasp.org/www-community/attacks/xss) prevention)

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
  - [Advance Usage](#advance-usage)
    - [Mention Module](#mention-module)
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
<link href="https://cdn.jsdelivr.net/npm/react-for-quill@latest/dist/quill.snow.css" rel="stylesheet" />
```
or
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/react-for-quill@latest/dist/quill.bubble.css" />
```

> [!WARNING]  
> jsdelivr alway cached when i publish new version. 
> So *@latest* flag can be older version.
> U can be wait or clear cached in [jsdelivr](https://www.jsdelivr.com/tools/purge)

---

### Basic Usage

Implement your code
```jsx
import React, { useState } from 'react';
import ReactQuill, { RFQValue } from 'react-for-quill';
import 'react-for-quill/dist/quill.snow.css';

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
> Watch all properties of Mention Module 👉 [here](https://github.com/Duc-Developer/react-for-quill/blob/main/src/Modules/Mention.ts)

## Advance Usage
These are many customization modules, formats, toolbars, etc. that may be useful for you.

### Mention Module
Basic for use Mention Module. See [live demo](https://duc-developer.github.io/react-for-quill)
```jsx
import ReactForQuill, { MentionBlot, Mention, Quill } from 'react-for-quill';
Quill.register({ "blots/mentionBlot": MentionBlot, "modules/mention": Mention });
function MyApp() {
  const mentionData = [{id: 1, value: 'A1'}, {id: 2, value: 'A2'}]
  return (
    <>
      <ReactForQuill
        ...
         modules={{
            mention: {
              allowedChars: /^[A-Za-z\s]*$/,
              denotationChars: ["@"],
              source: function (searchTerm, renderList) {
                if (searchTerm.length === 0) {
                  renderList(mentionData, searchTerm);
                } else {
                  const matches = [];
                  for (let i = 0; i < mentionData.length; i++) {
                    const matched = mentionData[i].value.toLowerCase().indexOf(searchTerm.toLowerCase());
                    if (matched > -1) {
                      matches.push(mentionData[i]);
                    }
                  }
                  renderList(matches, searchTerm);
                }
              }
            }
          }
      />
    </>
  );
}
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/Duc-Developer/react-for-quill. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](/CODE_OF_CONDUCT.md) code of conduct.

If you wish to contribute, see [CONTRIBUTING](/CONTRIBUTING.md) for development instructions and check out our pinned
[roadmap issue](https://github.com/Duc-Developer/react-for-quill/issues) for a list of tasks to get started.
