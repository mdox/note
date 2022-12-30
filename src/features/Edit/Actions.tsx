import { $generateHtmlFromNodes } from "@lexical/html";
import { $getRoot } from "lexical";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";
import { useEditor } from "../../modules/Editor";
import { Stage } from "../../utils/consts";
import { trpc } from "../../utils/trpc";
import { contentEditorId } from "./Content";
import { useEditContext } from "./Edit";

export default function Actions() {
  const router = useRouter();
  const { t } = useTranslation();
  const { info, noteId, refetch } = useEditContext();
  const editor = useEditor(contentEditorId);
  const { mutateAsync: deleteM } = trpc.edit.delete.useMutation();
  const { mutateAsync: saveM } = trpc.edit.save.useMutation();
  const { mutateAsync: publishM } = trpc.edit.publish.useMutation();

  const hasContentChanges = useCallback(() => {
    if (!info) return false;
    if (!editor) return false;
    let isEmpty = true;
    editor.getEditorState().read(() => {
      isEmpty = $getRoot().getTextContentSize() === 0;
    });
    if (isEmpty) return false;
    return JSON.stringify(editor.getEditorState()) !== info.bodyJson;
  }, [editor, info]);

  const hasDocChanges = useCallback(() => {
    if (!info) return false;
    return info.docs.some((doc) => doc.stage === Stage.Private);
  }, [info]);

  const hasAnyChanges = useCallback(() => {
    return hasDocChanges() || hasContentChanges();
  }, [hasContentChanges, hasDocChanges]);

  const handleDelete = useCallback(async () => {
    if (!confirm(t("confirm.delete"))) return;
    await deleteM({ noteId });
    router.push("/");
  }, [deleteM, noteId, router, t]);

  const handleBack = useCallback(() => {
    if (hasAnyChanges() && !confirm(t("confirm.discard"))) return;
    if (!info) return;
    if (info.stage === Stage.Private) {
      router.push("/");
    } else {
      router.push(`/view/${noteId}`);
    }
  }, [hasAnyChanges, info, noteId, router, t]);

  const handleSave = useCallback(async () => {
    if (!info) return;
    if (!editor) return;
    if (!hasAnyChanges()) return;

    const shouldSaveDocuments = hasDocChanges();
    const shouldSaveContent = hasContentChanges();

    if (shouldSaveDocuments && !shouldSaveContent) {
      await saveM({ noteId });
      await refetch();
      return;
    } else if (!shouldSaveContent) return;

    let title = "";
    let desc = "";
    let bodyHtml = "";
    let bodyJson = "";

    const editorState = editor.getEditorState();

    bodyJson = JSON.stringify(editorState);

    editorState.read(() => {
      bodyHtml = $generateHtmlFromNodes(editor, null);

      const textNodes = $getRoot().getAllTextNodes();
      title = textNodes[0]?.getTextContent() ?? "";
      desc = textNodes[1]?.getTextContent() ?? "";
    });

    await saveM({ noteId, title, desc, bodyHtml, bodyJson });
    await refetch();
  }, [
    editor,
    hasAnyChanges,
    hasContentChanges,
    hasDocChanges,
    info,
    noteId,
    refetch,
    saveM,
  ]);

  const handlePublish = useCallback(async () => {
    await handleSave();
    await publishM({ noteId });
    await refetch();
  }, [handleSave, noteId, publishM, refetch]);

  return (
    <div className="flex justify-between">
      <Button onClick={handleDelete}>{t("button.delete")}</Button>
      <span className="inline-flex gap-2">
        <Button onClick={handleBack}>{t("button.back")}</Button>
        <Button primary={info?.stage === Stage.Public} onClick={handleSave}>
          {t("button.save")}
        </Button>
        {info?.stage === Stage.Private ? (
          <Button primary onClick={handlePublish}>
            {t("button.publish")}
          </Button>
        ) : null}
      </span>
    </div>
  );
}
