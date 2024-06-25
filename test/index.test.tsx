import React from 'react';
import { test } from 'bun:test'; 
import { render, screen } from '@testing-library/react';
import ReactForQuill from '../src';

test('renders ReactForQuill', () => {
  render(<ReactForQuill 
    style={{ width: '40vw', height: 'calc(100vh - 60px)' }}
    theme='snow' 
    value='<p>Hello World!</p>'
    onChange={() => {}}
    
  />);
  const quillRoot = screen.getByTestId('ql-root');
  // expect(quillRoot).toBeInTheDocument();
});