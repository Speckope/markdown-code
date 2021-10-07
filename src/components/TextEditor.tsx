import './TextEditor.css';
import MDEditor from '@uiw/react-md-editor';
import React, { useEffect, useState, useRef } from 'react';

interface TextEditorProps {}

const TextEditor: React.FC<TextEditorProps> = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('# Header');

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      //
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        console.log('Clicked element is inside the editor');
        return;
      }

      console.log('Not inside.');

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
        <MDEditor value={value} onChange={(v) => setValue(v || '')} />
      </div>
    );
  }

  return (
    // card and card-content come from bulma
    <div className='text-editor card' onClick={() => setEditing(true)}>
      <div className='card-content'>
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
};

export default TextEditor;
