import ReactForQuill, { RFQValue } from 'react-for-quill';
import './App.css';
import { useState } from 'react';

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
        theme='snow' value={value}
        onChange={onChange}
        // modules={{
        //   mention: {
        //     getSuggestions: async (query: string) => {
        //       if (!query) return [];
        //       const response = await fetch('https://dummyjson.com/products');
        //       const data = await response.json();
        //       return data.products.filter((item) => {
        //         const lowerQuery = query.toLowerCase();
        //         return item.title.toLowerCase().includes(lowerQuery);
        //       }).map((item) => ({ label: item.title, value: item.id, ...item }));
        //     },
        //     style: { color: 'red' }
        //   }
        // }
        // }
      />
      <pre
        style={{
          border: '1px solid #ccc',
          marginTop: 0,
          marginLeft: 10,
          width: '60vw',
          height: 'calc(100vh - 18px)',
          padding: 10
        }}
      >
        <code>{escapeHtml(value as string)}</code>
      </pre>
    </div>
  );
}

export default App;
