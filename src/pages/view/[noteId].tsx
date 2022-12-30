import type { WithRouterProps } from "next/dist/client/with-router";
import Head from "next/head";
import { withRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { AfterHydration } from "../../features/AfterHydration/AfterHydration";
import View from "../../features/View/View";
import shipTranslations from "../../utils/shipTranslations";

export default withRouter(ViewPage);

function ViewPage({ router }: WithRouterProps) {
  const noteId = parseInt(router.query.noteId as string);
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("view.title")}</title>
      </Head>

      <AfterHydration>
        <View noteId={noteId} />
      </AfterHydration>
    </>
  );
}

export const getServerSideProps = shipTranslations();
