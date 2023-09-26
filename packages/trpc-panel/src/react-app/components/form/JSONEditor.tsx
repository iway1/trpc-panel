import React, { useEffect, useRef } from 'react';
import type JSONEditor from 'jsoneditor';

const jsonEditorImport = import('jsoneditor').then(({ default: JSONEditor }) => JSONEditor);

export default function JSONEditorDemo ({
  value,
  onChange,
}: {
  value: any;
  onChange: (value: any) => void;
}) {
  const editorRef = useRef(null);

  useEffect(() => {
    let abort = false;
    let newEditor: JSONEditor;
    jsonEditorImport.then(JSONEditor => {
      if (!abort && editorRef.current) {
        newEditor = new JSONEditor(editorRef.current, {
          mode: 'code',
          history: false,
          onChange: () => {
            try {
              onChange(newEditor.get());
            } catch (err) {}
          },
        });
        newEditor.set(value);
      }
    });

    return () => {
      abort = true;
      if (newEditor) {
        newEditor.destroy();
      }
    };
  }, [ editorRef.current, value ]);

  return (
    <div className="jsoneditor-react-container" ref={editorRef} />
  );
}
