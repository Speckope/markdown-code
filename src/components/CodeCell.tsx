import React, { useEffect } from 'react';
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { useState } from 'react';
import bundleFunction from '../bundler';
import CodeEditor from './CodeEditor';
import Preview from './Preview';
import ResizableComponent from './ResizableComponent';

interface CodeCellProps {}

const CodeCell: React.FC<CodeCellProps> = () => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundleFunction(input);

      setCode(output);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <ResizableComponent direction='vertical'>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <ResizableComponent direction='horizontal'>
          <CodeEditor
            initialValue='// Start Typing'
            onChange={(value) => setInput(value)}
          />
        </ResizableComponent>
        <Preview code={code} />
      </div>
    </ResizableComponent>
  );
};

export default CodeCell;
