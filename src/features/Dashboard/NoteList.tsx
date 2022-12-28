import { mdiComment, mdiFileDocument } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import Link from "next/link";
import { formatDateTime, formatMonogram } from "../../utils/formatters";
import { trpc } from "../../utils/trpc";

export default function NoteList() {
  const { data: list = [] } = trpc.dashboard.getNoteList.useQuery();

  if (list.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {list.map((note) => (
        <NoteItem
          key={note.id}
          id={note.id}
          username={note.user.name}
          title={note.title}
          desc={note.desc}
          hasDocs={note.docs.length > 0}
          hasComments={note.comments.length > 0}
          publishedAt={note.publishedAt}
        />
      ))}
    </div>
  );
}

type NoteItemProps = {
  id: number;
  username: string;
  title: string;
  desc: string;
  hasDocs: boolean;
  hasComments: boolean;
  publishedAt: string;
};

function NoteItem({
  id,
  username,
  title,
  desc,
  hasDocs,
  hasComments,
  publishedAt,
}: NoteItemProps) {
  return (
    <Link
      href={`/view/${id}`}
      className="flex gap-2 rounded-lg p-2 hover:bg-gray-700"
    >
      <span className="inline-flex h-12 w-12 select-none items-center justify-center rounded-full bg-gray-600 text-xl font-semibold opacity-50 ring-2 ring-gray-50">
        {formatMonogram(username)}
      </span>
      <div className="flex grow flex-col">
        <div className="flex items-center gap-2">
          <span className="relative grow">
            <br />
            <span className="absolute inset-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
              {title}
            </span>
          </span>
          <span className="text-sm opacity-50">
            {formatDateTime(publishedAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative grow">
            <br />
            <span className="absolute inset-0 overflow-hidden text-ellipsis whitespace-nowrap opacity-50">
              {desc}
            </span>
          </span>
          <span className="inline-flex gap-2">
            <Icon
              path={mdiFileDocument}
              size={0.75}
              className={clsx(hasDocs || "opacity-50")}
            />
            <Icon
              path={mdiComment}
              size={0.75}
              className={clsx(hasComments || "opacity-50")}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
