import React, { useEffect } from 'react';
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { useState } from 'react';
import bundleFunction from '../bundler';
import CodeEditor from './CodeEditor';
import Preview from './Preview';
import ResizableComponent from './ResizableComponent';
import { Cell } from '../state';
import { useActions } from './hooks/useActions';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell } = useActions();

  const [code, setCode] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundleFunction(cell.content);

      setCode(output.code);
      setErr(output.error);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

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
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </ResizableComponent>
        <Preview err={err} code={code} />
      </div>
    </ResizableComponent>
  );
};

export default CodeCell;
