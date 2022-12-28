/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InitialEditorStateType } from "@lexical/react/LexicalComposer";
import type {
  EditorThemeClasses,
  Klass,
  LexicalEditor,
  LexicalNode,
} from "lexical";

export type InitialConfig = Readonly<{
  editor__DEPRECATED?: LexicalEditor | null;
  namespace: string;
  nodes?: ReadonlyArray<
    | Klass<LexicalNode>
    | {
        replace: Klass<LexicalNode>;
        with: <
          T extends {
            new (...args: any): any;
          }
        >(
          node: InstanceType<T>
        ) => LexicalNode;
      }
  >;
  onError: (error: Error, editor: LexicalEditor) => void;
  editable?: boolean;
  theme?: EditorThemeClasses;
  editorState?: InitialEditorStateType;
}>;
