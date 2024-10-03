import ReactForQuill, { RFQValue, MentionBlot, Mention } from 'react-for-quill';
import './App.css';
import { useEffect, useState } from 'react';
import mentionData from './dummy/mention-data.json';
import hljs from 'highlight.js';
import pretty from 'pretty';
import { Delta } from 'quill/core';

const defaultValue = "<p>Dear <span class=\"mention\" data-index=\"99\" data-denotation-char=\"@\" data-id=\"d8890706-2f38-45dd-9513-614edd39ff6a\" data-value=\"Ameline\">﻿<span contenteditable=\"false\">@Ameline</span>﻿</span>,</p>\n<p></p>\n<p>Welcome to our store! We are thrilled to have you as a new customer and we look forward to serving you.</p>\n<p></p>\n<p>If you have any <u>questions</u> or need <u>assistance</u>, feel free to reach out to us at any time.</p>\n<p></p>\n<p>Thank you for choosing us!</p>\n<p></p>\n<p><strong>Best regards,</strong></p>\n<p><em>David</em></p>\n<p><a href=\"https://www.npmjs.com/package/react-for-quill\" rel=\"noopener noreferrer\" target=\"_blank\">react-for-quill</a></p>";
const defaultValue1 = '<p>Hello world!</p>';
const defaultValue2 = '<p><strong>bold</strong></p>';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('xml', xml);
ReactForQuill.Quill.register({ "blots/mentionBlot": MentionBlot, "modules/mention": Mention });

function App() {
  const [initialValue, setInitialValue] = useState<RFQValue>(defaultValue);
  const [value, setValue] = useState<RFQValue>(initialValue);
  const [displayRaw, setDisplayRaw] = useState('');

  useEffect(() => {
    const htmlString = value instanceof Delta ? 'not supported' : value;
    setDisplayRaw(pretty(htmlString, { ocd: true }));
    hljs.highlightAll();
  }, [value]);

  const handleRandomDefaultValue = () => {
    switch (initialValue) {
      case defaultValue:
        setInitialValue(defaultValue1);
        break;
      case defaultValue1:
        setInitialValue(defaultValue2);
        break;
      case defaultValue2:
        setInitialValue(defaultValue);
        break;
      default:
        setInitialValue(defaultValue);
        break;
    }
  };
  return (
    <div style={{ display: 'flex' }}>
      <div className='editor'>
        <button className='rand-btn' onClick={handleRandomDefaultValue}>random value</button>
        <ReactForQuill
          theme='snow'
          defaultValue={initialValue}
          onChange={setValue}
          style={{ width: '100%', height: 'calc(100% - 30px)' }}
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
          }
        />
      </div>

      <div style={{ marginLeft: 20, marginTop: 20 }}>
        <pre className="html">
          <code className="html" dangerouslySetInnerHTML={{
            __html: hljs.highlight(
              displayRaw,
              { language: 'xml' }
            ).value
          }}>
          </code>
        </pre>
      </div>
    </div>
  );
}

export default App;
