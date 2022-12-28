import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export type ContentEditableProps = {
  minLines?: number;
};

export default function ContentEditable(props: ContentEditableProps) {
  const { minLines = 3 } = props;

  const [editor] = useLexicalComposerContext();

  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  useEffect(() => {
    setIsEditable(editor.isEditable());
    return editor.registerEditableListener((editable) => {
      setIsEditable(editable);
    });
  }, [editor]);

  return (
    <LexicalContentEditable
      style={{
        minHeight: `${Math.max(2.5, 1 + 1.5 * minLines)}rem`,
      }}
      className={twMerge(
        "relative box-border block resize-none overflow-y-auto overflow-x-hidden border-0 px-3 py-2 outline-none",
        clsx(isEditable && "resize-y")
      )}
    />
  );
}
