import './CodeCell.css';
import React, { useEffect } from 'react';
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import CodeEditor from './CodeEditor';
import Preview from './Preview';
import ResizableComponent from './ResizableComponent';
import { Cell } from '../state';
import { useActions } from './hooks/useActions';
import { useTypedSelector } from './hooks/useTypedSelector';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();

  // We take bundleId
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  useEffect(() => {
    // This will eliminate initial flash in iframe.
    if (!bundle) {
      createBundle(cell.id, cell.content);
      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cell.content);
    }, 750);

    return () => {
      clearTimeout(timer);
    };
    // We don't want to put in bundle in dependencies, or we will enter an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.content, cell.id, createBundle]);

  return (
    <ResizableComponent direction='vertical'>
      <div
        style={{
          height: 'calc(100% - 10px)',
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

        <div className='progress-wrapper'>
          {!bundle || bundle.loading ? (
            <div className='progress-cover'>
              <progress className='progress is-small is-primary' max='100'>
                Loading
              </progress>
            </div>
          ) : (
            <Preview err={bundle.error} code={bundle.code} />
          )}
        </div>
      </div>
    </ResizableComponent>
  );
};

export default CodeCell;
