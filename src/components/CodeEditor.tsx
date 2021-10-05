import './CodeEditor.css';
import './syntax.css';
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';

import React, { useRef } from 'react';

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const onEditorDidMount: EditorDidMount = (getEditorValue, monacoEditor) => {
    editorRef.current = monacoEditor;

    // This runs whenever content inside MonacoEditor changes
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getEditorValue());
    });

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      monacoEditor
    );

    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  const onFormatClick: React.MouseEventHandler<HTMLButtonElement> | undefined =
    () => {
      // Get current value from the editor
      const unformatted = editorRef.current?.getModel()?.getValue();
      // Parse it with prettier
      if (unformatted) {
        const formated = prettier
          .format(unformatted, {
            parser: 'babel',
            plugins: [parser],
            useTabs: false,
            // adds semicolons
            semi: true,
            // Uses single quotes whenever possible
            singleQuote: true,
            //replace new line character at the end with  an empty string. (prettier always adds one line)
          })
          .replace(/\n$/, '');

        // Set formatted value to the editor
        editorRef.current?.setValue(formated);
      }
    };

  return (
    <div className='editor-wrapper'>
      <button
        className='button button-format is-primary is-small'
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        options={{
          wordWrap: 'on',
          minimap: {
            enabled: false,
          },
          showUnused: false,
          // colapse left margin
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          // Editor should update itself on the screen correctly
          automaticLayout: true,
        }}
        theme='dark'
        language='javascript'
        height='500px'
      />
    </div>
  );
};

export default CodeEditor;
