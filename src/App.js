import React, { useState, useEffect } from 'react';
import './App.css';
import { Editor, EditorState, convertFromRaw, convertToRaw, Modifier, SelectionState } from 'draft-js';
import 'draft-js/dist/Draft.css';

function App() {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  useEffect(() => {
    const saveContent = () => {
      const contentState = editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);
      localStorage.setItem('editorContent', JSON.stringify(rawContentState));
    };
    window.addEventListener('beforeunload', saveContent);
    return () => {
      window.removeEventListener('beforeunload', saveContent);
    };
  }, [editorState]);

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    localStorage.setItem('editorContent', JSON.stringify(rawContentState));
  };

  const handleEditorChange = (newEditorState) => {
    const contentState = newEditorState.getCurrentContent();
    const selectionState = newEditorState.getSelection();

    
    const lastBlock = contentState.getLastBlock();
    const lastBlockText = lastBlock.getText();
    if (lastBlockText.startsWith('* ') && lastBlockText.length > 2) {
      const newContentState = Modifier.applyInlineStyle(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: lastBlockText.length,
        }),
        'BOLD'
      );
      newEditorState = EditorState.push(newEditorState, newContentState, 'change-inline-style');
    }

    setEditorState(newEditorState);
  };

  return (
    <div className="App">
      <div className="header">
        <h1 className="title">Demo editor by Abhishek Mishra</h1>
        <button className="saveButton" onClick={handleSave}>Save</button>
      </div>
      <div className="editor">
        <Editor editorState={editorState} onChange={handleEditorChange} />
      </div>
    </div>
  );
}

export default App;
