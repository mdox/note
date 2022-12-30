import { mdiFileDocument } from "@mdi/js";
import Icon from "@mdi/react";
import mime from "mime-types";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { formatBasename } from "../../utils/formatters";
import { useViewContext } from "./View";

export default function DocList() {
  const { t } = useTranslation();
  const { info } = useViewContext();
  const { docs } = info ?? { docs: [] };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-lg font-semibold">{t("title.documents")}</div>
      {docs.length === 0 ? (
        <div className="italic opacity-50">{t("info.no-documents")}</div>
      ) : null}
      <Images />
      <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
        {docs.map((doc) => (
          <DocItem key={doc.path} path={doc.path} />
        ))}
      </div>
    </div>
  );
}

type DocItemProps = {
  path: string;
};

function DocItem({ path }: DocItemProps) {
  return (
    <span className="inline-flex gap-2">
      <Link
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        download={formatBasename(path)}
        className="inline-flex grow items-center gap-2 rounded px-3 py-2 hover:bg-gray-700 active:bg-gray-800"
      >
        <Icon path={mdiFileDocument} size={0.75} />
        <span className="relative grow">
          <br />
          <span className="absolute inset-0 overflow-hidden text-ellipsis whitespace-nowrap font-light">
            {formatBasename(path)}
          </span>
        </span>
      </Link>
    </span>
  );
}

function Images() {
  const { info } = useViewContext();

  const images = useMemo(
    () =>
      info?.docs.filter((v) =>
        (mime.lookup(v.path) || "").startsWith("image/")
      ) ?? [],
    [info?.docs]
  );

  return images.length === 0 ? null : (
    <div className="flex flex-nowrap gap-2 overflow-y-hidden overflow-x-scroll pb-2">
      {images.map(({ path }) => (
        <span key={path} className="relative h-40 w-40 shrink-0">
          <Link href={path} target="_blank" rel="noopener noreferrer">
            <Image
              src={path}
              alt={formatBasename(path)}
              width={160}
              height={160}
              className="h-full w-full object-cover object-center"
            />
          </Link>
          <span className="absolute top-0 left-0 right-0 p-2">
            <br />
            <span className="absolute inset-0 select-none overflow-hidden text-ellipsis whitespace-nowrap rounded p-2 font-light ring-inset ring-gray-600 hover:right-auto hover:z-[9999] hover:select-auto hover:overflow-visible hover:bg-gray-900 hover:ring-2">
              {formatBasename(path)}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
