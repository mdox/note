import { $generateHtmlFromNodes } from "@lexical/html";
import { mdiSend } from "@mdi/js";
import Icon from "@mdi/react";
import { $getRoot, CLEAR_HISTORY_COMMAND } from "lexical";
import { useCallback } from "react";
import Button from "../../components/Button";
import { useEditor } from "../../modules/Editor";
import PlainTextEditor from "../../modules/Editor/PlainTextEditor";
import { trpc } from "../../utils/trpc";
import { useViewContext } from "./View";

export default function Commenting() {
  const { noteId } = useViewContext();
  const editorId = "comment-editor";
  const editor = useEditor(editorId);
  const utils = trpc.useContext();
  const { mutateAsync: sendCommentM, isLoading } =
    trpc.view.sendComment.useMutation();
  const refetchComments = utils.view.comments.refetch;

  const handleSend = useCallback(async () => {
    if (!editor) return;

    let bodyHtml = "";
    let isEmpty = true;

    editor.getEditorState().read(() => {
      bodyHtml = $generateHtmlFromNodes(editor, null);
      isEmpty = $getRoot().getTextContent().trim() === "";
    });

    if (isEmpty) return;

    await sendCommentM({ noteId, bodyHtml });

    editor.update(() => $getRoot().clear());
    editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
    setTimeout(() => editor.blur(), 1);

    await refetchComments({ noteId });
  }, [editor, noteId, refetchComments, sendCommentM]);

  return (
    <div className="flex items-end gap-2">
      <span className="grow">
        <PlainTextEditor id={editorId} />
      </span>
      <Button className="p-2" disabled={isLoading} onClick={handleSend}>
        <Icon path={mdiSend} size={0.75} />
      </Button>
    </div>
  );
}
