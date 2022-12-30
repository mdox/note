import { mdiDotsVertical, mdiNoteEdit } from "@mdi/js";
import Icon from "@mdi/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Dropdown, { DropdownItem } from "../../components/Dropdown";
import { EditorThemeStyles } from "../../modules/Editor/themes/EditorTheme/EditorTheme";
import { formatDateTime } from "../../utils/formatters";
import { useViewContext } from "./View";

export default function Content() {
  const router = useRouter();
  const { t } = useTranslation();
  const { info, noteId } = useViewContext();

  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");

  useEffect(() => {
    if (!info) return;
    const parsedBodyHtml = new DOMParser().parseFromString(
      info.bodyHtml,
      "text/html"
    ).body;

    let titleNode: Node | null = null;

    for (const node of parsedBodyHtml.childNodes) {
      if (node.textContent?.trim()) {
        titleNode = node;
        break;
      }
    }

    if (!titleNode) return;

    const titleText = titleNode.textContent;

    if (!titleText) return;

    for (let node = parsedBodyHtml.firstChild; node; node = node.nextSibling) {
      parsedBodyHtml.removeChild(node);
      if (node === titleNode) break;
    }

    for (let node = parsedBodyHtml.firstChild; node; node = node.nextSibling) {
      if (node.textContent?.trim()) break;
      parsedBodyHtml.removeChild(node);
    }

    setTitle(titleText);

    setContentHtml(parsedBodyHtml.innerHTML);
  }, [info]);

  if (info === undefined) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-2 flex items-center">
        <span className="relative grow text-2xl sm:text-3xl">
          <br />
          <span className="absolute inset-0 overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </span>
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="opacity-50 max-sm:text-sm">
            {formatDateTime(info.publishedAt)}
          </span>
          <Dropdown
            menuIcon={mdiDotsVertical}
            snapRight
            className="rounded-full p-2"
          >
            <DropdownItem
              disabled={!info.isOwner}
              onClick={() => router.push(`/edit/${noteId}`)}
            >
              <Icon path={mdiNoteEdit} size={0.75} />
              {t("button.edit")}
            </DropdownItem>
          </Dropdown>
        </span>
      </div>
      <div
        className={EditorThemeStyles.ET}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
