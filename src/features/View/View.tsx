import { useTranslation } from "next-i18next";
import { createContext, useContext, useMemo } from "react";
import type { RouterOutputs } from "../../utils/trpc";
import { trpc } from "../../utils/trpc";
import Commenting from "./Commenting";
import CommentList from "./CommentList";
import Content from "./Content";
import DocList from "./DocList";

export type ViewProps = {
  noteId: number;
};

type ViewContextType = {
  noteId: number;
  info: RouterOutputs["view"]["info"] | undefined;
  refetch: () => void;
};

const ViewContext = createContext<ViewContextType | null>(null);

export function useViewContext() {
  const context = useContext(ViewContext);

  if (context === null)
    throw new Error("useViewContext must be used within a View");

  return context;
}

export default function View({ noteId }: ViewProps) {
  const { t } = useTranslation();
  const { data: info, refetch } = trpc.view.info.useQuery({ noteId });

  const value: ViewContextType = useMemo(
    () => ({
      noteId,
      info,
      refetch,
    }),
    [info, noteId, refetch]
  );

  return (
    <ViewContext.Provider value={value}>
      <Content />
      <hr />
      <DocList />
      <hr />
      <div className="flex flex-col gap-2">
        <div className="text-lg font-semibold">{t("title.comments")}</div>
        <Commenting />
        <CommentList />
      </div>
    </ViewContext.Provider>
  );
}
