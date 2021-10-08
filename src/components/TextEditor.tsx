import './TextEditor.css';
import MDEditor from '@uiw/react-md-editor';
import React, { useEffect, useState, useRef } from 'react';
import { Cell } from '../state';
import { useActions } from './hooks/useActions';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const { updateCell } = useActions();

  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      //
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }

      setEditing(false);
    };
    document.addEventListener('click', listener, {
      capture: true,
    });

    return () => {
      document.removeEventListener('click', listener, {
        capture: true,
      });
    };
  }, []);

  if (editing) {
    return (
      <div className='text-editor card' ref={ref}>
        {/* v || '' means that if v is undefines, setValue to empty string */}
        <MDEditor
          value={cell.content}
          onChange={(value) => updateCell(cell.id, value || '')}
        />
      </div>
    );
  }

  return (
    // card and card-content come from bulma
    <div className='text-editor card' onClick={() => setEditing(true)}>
      <div className='card-content'>
        <MDEditor.Markdown source={cell.content || 'Click to edit'} />
      </div>
    </div>
  );
};

export default TextEditor;
