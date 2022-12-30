import { mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import { useCallback } from "react";
import Button from "../../components/Button";
import { EditorThemeStyles } from "../../modules/Editor/themes/EditorTheme/EditorTheme";
import { formatDateTime, formatMonogram } from "../../utils/formatters";
import { trpc } from "../../utils/trpc";
import { useViewContext } from "./View";

export default function CommentList() {
  const { noteId } = useViewContext();
  const { data: comments = [], refetch } = trpc.view.comments.useQuery({
    noteId,
  });

  if (comments.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          id={comment.id}
          username={comment.username}
          bodyHtml={comment.bodyHtml}
          isOwner={comment.isOwner}
          createdAt={comment.createdAt}
          refetchComments={refetch}
        />
      ))}
    </div>
  );
}

type CommentItemProps = {
  id: number;
  username: string;
  bodyHtml: string;
  isOwner: boolean;
  createdAt: string;
  refetchComments: () => void;
};

function CommentItem({
  id,
  username,
  bodyHtml,
  isOwner,
  createdAt,
  refetchComments,
}: CommentItemProps) {
  const { mutateAsync: deleteCommentM } = trpc.view.deleteComment.useMutation();

  const handleDelete = useCallback(async () => {
    await deleteCommentM({ commentId: id });
    await refetchComments();
  }, [deleteCommentM, id, refetchComments]);

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-600 bg-gray-800 p-2">
      <span className="float-left mr-2">
        <span className="inline-flex h-12 w-12 select-none items-center justify-center rounded-full bg-gray-600 text-xl font-semibold opacity-50 ring-2 ring-gray-50">
          {formatMonogram(username)}
        </span>
      </span>
      <span className="float-right ml-2 text-sm opacity-50">
        {formatDateTime(createdAt)}
      </span>
      <div
        className={EditorThemeStyles.ET}
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
      {isOwner ? (
        <Button
          className="absolute right-0 bottom-0 rounded-full rounded-br-none p-2 opacity-25 hover:opacity-100"
          onClick={handleDelete}
        >
          <Icon path={mdiTrashCan} size={0.75} />
        </Button>
      ) : null}
    </div>
  );
}
