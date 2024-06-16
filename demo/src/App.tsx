import ReactForQuill, { RFQValue } from 'react-for-quill';
import './App.css';
import { useState } from 'react';

function App() {
  const [value, setValue] = useState<RFQValue>('');
  const onChange = (html: string) => {
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

export default App;
