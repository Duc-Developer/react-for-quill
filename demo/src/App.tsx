import ReactForQuill, { RFQValue } from 'react-for-quill';
import './App.css';
import { useState } from 'react';

const defaultValue = "<p>Dear <span data-user-id=\"29\" quill-type=\"mention\" contenteditable=\"false\" class=\"mention-blot select-none\" style=\"color: red;\">@Juice</span>​,</p><p></p><p>Welcome to our store! We are thrilled to have you as a new customer and we look forward to serving you.</p><p></p><p>If you have any <u>questions</u> or need <u>assistance</u>, feel free to reach out to us at any time.</p><p></p><p>Thank you for choosing us!</p><p></p><p><strong>Best regards,</strong></p><p><em>David</em></p><p><a href=\"www.google.com\" rel=\"noopener noreferrer\" target=\"_blank\">www.google.com</a></p>";
const defaultValue1 = '<p>Hello world!</p>';
const defaultValue2 = '<p><strong>bold</strong></p>';
function App() {
  const [initialValue, setInitialValue] = useState<RFQValue>(defaultValue);
  const [value, setValue] = useState<RFQValue>(initialValue);

  const escapeHtml = (html: string) => {
    return html.replace(/<\/p>/g, '</p>\n');
  };
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
  const atValues = [
    { id: 1, value: "Fredrik Sundqvist" },
    { id: 2, value: "Patrik Sjölin" }
  ];
  const hashValues = [
    { id: 3, value: "Fredrik Sundqvist 2" },
    { id: 4, value: "Patrik Sjölin 2" }
  ];
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '40vw', height: 'calc(100vh - 60px)' }}>
        <button className='rand-btn' onClick={handleRandomDefaultValue}>random value</button>
        <ReactForQuill
          theme='snow'
          defaultValue={initialValue}
          onChange={setValue}
          style={{ width: '100%', height: 'calc(100% - 30px)' }}
          modules={{
            mention: {
              allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
              mentionDenotationChars: ["@", "#"],
              source: function (searchTerm, renderList, mentionChar) {
                let values;

                if (mentionChar === "@") {
                  values = atValues;
                } else {
                  values = hashValues;
                }

                if (searchTerm.length === 0) {
                  renderList(values, searchTerm);
                } else {
                  const matches = [];
                  for (let i = 0; i < values.length; i++)
                    if (
                      ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
                    )
                      matches.push(values[i]);
                  renderList(matches, searchTerm);
                }
              }
            }
          }
          }
        />
      </div>

      <div style={{ marginLeft: 20, marginTop: 30 }}>
        <textarea
          style={{
            display: 'block', width: 'calc(60vw - 20px)',
            height: 'calc(100vh - 68px)',
            padding: 10
          }}
          value={escapeHtml(value as string)}
          readOnly={true}
        />
      </div>
    </div>
  );
}

export default App;
