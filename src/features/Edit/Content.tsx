import { CLEAR_HISTORY_COMMAND } from "lexical";
import { useEffect } from "react";
import { useEditor } from "../../modules/Editor";
import RichTextEditor from "../../modules/Editor/RichTextEditor";
import { useEditContext } from "./Edit";

export const contentEditorId = "content-editor";

export default function Content() {
  const { info } = useEditContext();
  const editor = useEditor(contentEditorId);

  useEffect(() => {
    if (!info) return;
    if (!info.bodyJson) return;
    if (!editor) return;
    if (JSON.stringify(editor.getEditorState()) === info.bodyJson) return;

    editor.setEditorState(editor.parseEditorState(info.bodyJson));
    editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
  }, [editor, info]);

  return <RichTextEditor id={contentEditorId} />;
}
