import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import type { ReactNode } from "react";
import ContentEditable from "./components/ContentEditable";
import Placeholder from "./components/Placeholder";
import { EditorNodes } from "./nodes/EditorNodes";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import { MultipleEditorStorePlugin } from "./plugins/MultipleEditorStorePlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import {
  EditorTheme,
  EditorThemeStyles,
} from "./themes/EditorTheme/EditorTheme";
import type { InitialConfig } from "./types/InitialConfig";

export type RichEditorProps = {
  id: string;
  placeholderContent?: ReactNode;
  initialConfig?: Partial<InitialConfig>;
};

export default function RichTextEditor(props: RichEditorProps) {
  const { nodes = [], ...restInitialConfig } = props.initialConfig ?? {};

  const initialConfig: InitialConfig = {
    namespace: `RichTextEditor_${props.id}`,
    onError(error: Error) {
      console.error(props.id, error);
    },
    theme: EditorTheme,
    nodes: [...EditorNodes, ...nodes].filter((v, k, a) => k === a.indexOf(v)),
    ...restInitialConfig,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="grid grid-cols-1 divide-y divide-gray-600 overflow-hidden rounded-lg border border-gray-600">
        <div>
          <ToolbarPlugin />
        </div>
        <div className={EditorThemeStyles.ET}>
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={<Placeholder>{props.placeholderContent}</Placeholder>}
          />

          <LinkPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <AutoLinkPlugin />
          <HistoryPlugin />
          <TabIndentationPlugin />
          <MultipleEditorStorePlugin id={props.id} />
        </div>
      </div>
    </LexicalComposer>
  );
}
