import ReactForQuill, { RFQValue } from 'react-for-quill';
import './App.css';
import { useState } from 'react';

const defaultValue = "<p>Dear <span data-user-id=\"29\" quill-type=\"mention\" contenteditable=\"false\" class=\"mention-blot select-none\" style=\"color: red;\">@Juice</span>​,</p><p></p><p>Welcome to our store! We are thrilled to have you as a new customer and we look forward to serving you.</p><p></p><p>If you have any <u>questions</u> or need <u>assistance</u>, feel free to reach out to us at any time.</p><p></p><p>Thank you for choosing us!</p><p></p><p><strong>Best regards,</strong></p><p><em>David</em></p><p><a href=\"www.google.com\" rel=\"noopener noreferrer\" target=\"_blank\">www.google.com</a></p>";
function App() {
  const [value, setValue] = useState<RFQValue>('');
  const onChange = (html: string) => {
    setValue(html);
  };
  const escapeHtml = (html: string) => {
    return html.replace(/<\/p>/g, '</p>\n');
  };
  return (
    <div style={{ display: 'flex' }}>
      <ReactForQuill
        style={{ width: '40vw', height: 'calc(100vh - 60px)' }}
        theme='snow' 
        value={defaultValue}
        onChange={onChange}
        modules={{
          mention: {
            getSuggestions: async (query: string) => {
              if (!query) return [];
              const response = await fetch('https://dummyjson.com/products');
              const data = await response.json();
              return data.products.filter((item) => {
                const lowerQuery = query.toLowerCase();
                return item.title.toLowerCase().includes(lowerQuery);
              }).map((item) => ({ label: item.title, value: item.id, ...item }));
            },
            style: { color: 'red' }
          }
        }
        }
      />
      <div style={{ marginLeft: 20 }}>
        <textarea
          style={{
            display: 'block', width: 'calc(60vw - 20px)',
            height: 'calc(100vh - 38px)',
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
