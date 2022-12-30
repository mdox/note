import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useCallback } from "react";
import Button from "../../components/Button";
import { trpc } from "../../utils/trpc";

export default function MakeNote() {
  const router = useRouter();
  const { t } = useTranslation();
  const { mutateAsync: makeNote } = trpc.dashboard.makeNote.useMutation();

  const handleClick = useCallback(async () => {
    const note = await makeNote();
    router.push(`/edit/${note.id}`);
  }, [makeNote, router]);

  return <Button onClick={handleClick}>{t("button.make-note")}</Button>;
}
