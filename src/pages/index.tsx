import { useTranslation } from "next-i18next";
import Head from "next/head";
import { AfterHydration } from "../features/AfterHydration/AfterHydration";
import Dashboard from "../features/Dashboard/Dashboard";
import shipTranslations from "../utils/shipTranslations";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("dashboard.title")}</title>
      </Head>
      <AfterHydration>
        <Dashboard />
      </AfterHydration>
    </>
  );
}

export const getServerSideProps = shipTranslations();
