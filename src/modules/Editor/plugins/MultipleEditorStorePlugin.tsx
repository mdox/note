// Source: https://github.com/facebook/lexical/discussions/2481

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { useEditors } from "../providers/EditorProvider";

export type MultipleEditorStorePluginProps = {
  id: string;
};

export function MultipleEditorStorePlugin(
  props: MultipleEditorStorePluginProps
) {
  const { id } = props;
  const [editor] = useLexicalComposerContext();
  const editors = useEditors();
  useEffect(() => {
    editors.createEditor(id, editor);
    return () => editors.deleteEditor(id);
  }, [id, editor]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
