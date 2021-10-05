import React from 'react';
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { useState } from 'react';
import bundleFunction from '../bundler';
import CodeEditor from './CodeEditor';
import Preview from './Preview';

interface CodeCellProps {}

const CodeCell: React.FC<CodeCellProps> = () => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  const onCLick = async () => {
    const output = await bundleFunction(input);

    setCode(output);
  };

  return (
    <div>
      <CodeEditor
        initialValue='// Start Typing'
        onChange={(value) => setInput(value)}
      />

      <div>
        <button onClick={onCLick}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};

export default CodeCell;
