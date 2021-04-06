import { useRef } from "react";
import { Editor } from "react-draft-wysiwyg";

function EditorComponent({ editorState, setEditorState }) {
  const editorRef = useRef(null);

  const focusEditor = () => {
    editorRef.current.focus();
  };

  return (
    <div className="min-h-40rem p-2 ring-1 ring-gray-100" onClick={focusEditor}>
      <Editor
        editorRef={(ref) => (editorRef.current = ref)}
        editorState={editorState}
        onEditorStateChange={(_editorState) => setEditorState(_editorState)}
      />
    </div>
  );
}

export default EditorComponent;
