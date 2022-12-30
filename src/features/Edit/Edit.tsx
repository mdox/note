import { createContext, useContext, useMemo } from "react";
import type { RouterOutputs } from "../../utils/trpc";
import { trpc } from "../../utils/trpc";
import Actions from "./Actions";
import Content from "./Content";
import DocList from "./DocList";

export type EditProps = {
  noteId: number;
};

export type EditContextType = {
  noteId: number;
  info: RouterOutputs["edit"]["info"] | undefined;
  refetch: () => void;
};

export const EditContext = createContext<EditContextType | null>(null);

export function useEditContext() {
  const context = useContext(EditContext);

  if (context === null) throw new Error("No context. Use `Edit`.");

  return context;
}

export default function Edit({ noteId }: EditProps) {
  const { data: info, refetch } = trpc.edit.info.useQuery({ noteId });

  const value = useMemo<EditContextType>(
    () => ({
      noteId,
      info,
      refetch,
    }),
    [info, noteId, refetch]
  );

  return (
    <div className="flex flex-col gap-2">
      <EditContext.Provider value={value}>
        <Content />
        <DocList />
        <Actions />
      </EditContext.Provider>
    </div>
  );
}
