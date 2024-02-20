import React, { useState, useEffect } from 'react';
import './App.css';
import { Editor, EditorState, ContentState, convertFromRaw, convertToRaw } from 'draft-js';
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

  return (
    <div className="App">
      <div className="header">
        <h1 className="title">Demo editor by Abhishek Mishra</h1>
        <button className="saveButton" onClick={handleSave}>Save</button>
      </div>
      <div className="editor">
        <Editor editorState={editorState} onChange={setEditorState} />
      </div>
    </div>
  );
}

export default App;
