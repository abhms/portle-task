import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Editor,
  EditorState,
  convertFromRaw,
  convertToRaw,
  Modifier,
  RichUtils,
} from "draft-js";
import "draft-js/dist/Draft.css";

function App() {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
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
      localStorage.setItem("editorContent", JSON.stringify(rawContentState));
    };
    window.addEventListener("beforeunload", saveContent);
    return () => {
      window.removeEventListener("beforeunload", saveContent);
    };
  }, [editorState]);

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContentState));
  };

  const handleEditorChange = (newEditorState) => {
    let contentState = newEditorState.getCurrentContent();
    let selectionState = newEditorState.getSelection();

    const lastBlock = contentState.getLastBlock();
    const lastBlockText = lastBlock.getText();

    if (lastBlockText.startsWith("# ") && lastBlockText.length > 2) {
      contentState = Modifier.setBlockType(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: lastBlockText.length,
        }),
        "header-one"
      );
      contentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: 1,
        }),
        ""
      );
    } else if (lastBlockText.startsWith("* ") && lastBlockText.length > 2) {
      contentState = Modifier.applyInlineStyle(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: lastBlockText.length,
        }),
        "BOLD"
      );
      contentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: 1,
        }),
        ""
      );
    } else if (lastBlockText.startsWith("** ") && lastBlockText.length > 2) {
      contentState = Modifier.applyInlineStyle(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: lastBlockText.length,
        }),
        { textColor: "#ff0000" }
      );
      contentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: 2,
        }),
        ""
      );
    } else if (lastBlockText.startsWith("*** ") && lastBlockText.length > 3) {
      contentState = Modifier.applyInlineStyle(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: lastBlockText.length,
        }),
        "UNDERLINE"
      );
      contentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: 3,
        }),
        ""
      );
    }

    newEditorState = EditorState.push(
      newEditorState,
      contentState,
      "change-block-type"
    );
    setEditorState(newEditorState);
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  return (
    <div className="App">
      <div className="header">
        <h1 className="title">Demo editor by Abhishek Mishra</h1>
        <button className="saveButton" onClick={handleSave}>
          Save
        </button>
      </div>
      <div className="editor">
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
    </div>
  );
}

export default App;
