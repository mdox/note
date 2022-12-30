import { mdiCheckboxBlank, mdiCheckboxMarked, mdiFileDocument } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import mime from "mime-types";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "../../components/Button";
import { Stage } from "../../utils/consts";
import { formatBasename } from "../../utils/formatters";
import { trpc } from "../../utils/trpc";
import { useGlobalLoading } from "../GlobalLoading/GlobalLoading";
import { useEditContext } from "./Edit";

type DocListContextType = {
  selectedPaths: string[];
  addSelection: (path: string) => void;
  removeSelection: (path: string) => void;
};

const DocListContext = createContext<DocListContextType | null>(null);

export default function DocList() {
  const { t } = useTranslation();
  const { info } = useEditContext();
  const { docs } = info ?? { docs: [] };

  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);

  const value = useMemo<DocListContextType>(() => {
    const result: DocListContextType = {
      selectedPaths,
      addSelection: (path: string) => {
        if (selectedPaths.length === 0) setSelectedPaths([path]);
        else selectedPaths.push(path);
      },
      removeSelection: (path: string) => {
        if (selectedPaths.length === 1) setSelectedPaths([]);
        else selectedPaths.splice(selectedPaths.indexOf(path), 1);
      },
    };

    return result;
  }, [selectedPaths]);

  useEffect(() => {
    const docPathsMap = new Map(docs.map((v) => [v.path, true]));
    const newPaths = selectedPaths.filter((v) => docPathsMap.has(v));
    const newPathsMap = new Map(newPaths.map((v) => [v, true]));
    if (!selectedPaths.every((v) => newPathsMap.has(v))) {
      setSelectedPaths(newPaths);
    }
  }, [docs, selectedPaths]);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-lg font-semibold">{t("title.documents")}</div>
      {docs.length === 0 ? (
        <div className="italic opacity-50">{t("info.no-documents")}</div>
      ) : null}
      <Images />
      <DocListContext.Provider value={value}>
        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
          {docs.map((doc) => (
            <DocItem key={doc.path} path={doc.path} stage={doc.stage} />
          ))}
        </div>
        <DetachDoc />
      </DocListContext.Provider>
      <AttachDoc />
    </div>
  );
}

function useDocListContext() {
  const context = useContext(DocListContext);

  if (context === null) throw new Error("No context.");

  return context;
}

function Images() {
  const { info } = useEditContext();

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

function DetachDoc() {
  const { t } = useTranslation();
  const { noteId, refetch } = useEditContext();
  const { selectedPaths } = useDocListContext();
  const { mutateAsync: detach } = trpc.edit.detach.useMutation();

  const handleDetach = useCallback(async () => {
    await detach({ noteId, paths: selectedPaths });
    await refetch();
  }, [detach, noteId, refetch, selectedPaths]);

  if (selectedPaths.length === 0) return null;

  return <Button onClick={handleDetach}>{t("button.detach-document")}</Button>;
}

function AttachDoc() {
  const { t } = useTranslation();
  const { noteId, refetch } = useEditContext();
  const { mutateAsync: attach } = trpc.edit.attach.useMutation();
  const { wrap } = useGlobalLoading();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(async () => {
    if (!inputRef.current) return;
    if (!inputRef.current.files) return;
    if (!inputRef.current.files.length) return;

    const files = [...inputRef.current.files];
    const formData = new FormData();

    for (const file of files) {
      formData.append("file", file);
    }

    const uploadResponse = await wrap(
      fetch(`/api/storage/upload/${noteId}`, {
        method: "POST",
        body: formData,
      })
    );

    if (uploadResponse.ok) {
      const data: (string | number)[] = await uploadResponse.json();
      const pairs = data.map((v, i) => [v, i]).filter(([v]) => Boolean(v)) as [
        string,
        number
      ][];

      const paths = pairs.map(
        ([fileid, fileIndex]) =>
          `/api/storage/download/${noteId}/${fileid}/${files[fileIndex]?.name}`
      );

      if (paths.length > 0) {
        await attach({
          noteId,
          paths,
        });

        await refetch();
      }
    }
  }, [attach, noteId, refetch, wrap]);

  return (
    <Button onClick={() => inputRef.current?.click()}>
      {t("button.attach-document")}
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onClick={(e) => (e.currentTarget.value = "")}
        onChange={handleChange}
      />
    </Button>
  );
}

type DocItemProps = {
  path: string;
  stage: string;
};

function DocItem({ path, stage }: DocItemProps) {
  const { addSelection, removeSelection, selectedPaths } = useDocListContext();

  const [selected, setSelected] = useState(selectedPaths.includes(path));

  const handleToggleSelect = useCallback(() => {
    if (selected) {
      setSelected(false);
      removeSelection(path);
    } else {
      setSelected(true);
      addSelection(path);
    }
  }, [addSelection, path, removeSelection, selected]);

  return (
    <span className="inline-flex gap-2">
      <Link
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        download={formatBasename(path)}
        className={clsx(
          "inline-flex grow items-center gap-2 rounded px-3 py-2 hover:bg-gray-700 active:bg-gray-800",
          selected && "bg-gray-600"
        )}
      >
        <Icon
          path={mdiFileDocument}
          size={0.75}
          className={clsx(stage === Stage.Private && "text-green-500")}
        />
        <span className="relative grow">
          <br />
          <span className="absolute inset-0 overflow-hidden text-ellipsis whitespace-nowrap font-light">
            {formatBasename(path)}
          </span>
        </span>
      </Link>
      <Button primary={selected} onClick={handleToggleSelect}>
        <Icon
          path={selected ? mdiCheckboxMarked : mdiCheckboxBlank}
          size={0.75}
        />
      </Button>
    </span>
  );
}
