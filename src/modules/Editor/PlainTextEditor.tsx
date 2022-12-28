import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import type { ReactNode } from "react";
import ContentEditable from "./components/ContentEditable";
import Placeholder from "./components/Placeholder";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import { MultipleEditorStorePlugin } from "./plugins/MultipleEditorStorePlugin";
import {
  EditorTheme,
  EditorThemeStyles,
} from "./themes/EditorTheme/EditorTheme";
import type { InitialConfig } from "./types/InitialConfig";

export type PlainEditorProps = {
  id: string;
  placeholderContent?: ReactNode;
  initialConfig?: Partial<InitialConfig>;
};

export default function PlainTextEditor(props: PlainEditorProps) {
  const { nodes = [], ...restInitialConfig } = props.initialConfig ?? {};

  const initialConfig: InitialConfig = {
    namespace: `PlainTextEditor_${props.id}`,
    onError(error: Error) {
      console.error(props.id, error);
    },
    theme: EditorTheme,
    nodes: [...[AutoLinkNode, LinkNode], ...nodes].filter(
      (v, k, a) => k === a.indexOf(v)
    ),
    ...restInitialConfig,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="overflow-hidden rounded-lg border border-gray-600">
        <div className={EditorThemeStyles.ET}>
          <PlainTextPlugin
            contentEditable={<ContentEditable minLines={2} />}
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={<Placeholder>{props.placeholderContent}</Placeholder>}
          />

          <LinkPlugin />
          <AutoLinkPlugin />
          <HistoryPlugin />
          <MultipleEditorStorePlugin id={props.id} />
        </div>
      </div>
    </LexicalComposer>
  );
}
