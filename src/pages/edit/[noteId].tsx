import type { WithRouterProps } from "next/dist/client/with-router";
import Head from "next/head";
import { withRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { AfterHydration } from "../../features/AfterHydration/AfterHydration";
import Edit from "../../features/Edit/Edit";
import shipTranslations from "../../utils/shipTranslations";

export default withRouter(EditPage);

function EditPage({ router }: WithRouterProps) {
  const noteId = parseInt(router.query.noteId as string);
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("edit.title")}</title>
      </Head>

      <AfterHydration>
        <Edit noteId={noteId} />
      </AfterHydration>
    </>
  );
}

export const getServerSideProps = shipTranslations();
