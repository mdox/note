import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import { type AppType } from "next/app";
import { AfterHydrationProvider } from "../features/AfterHydration/AfterHydration";
import Layout from "../layouts/Layout";
import { EditorProvider } from "../modules/Editor";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AfterHydrationProvider>
        <Layout>
          <EditorProvider>
            <Component {...pageProps} />
          </EditorProvider>
        </Layout>
      </AfterHydrationProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(appWithTranslation(MyApp));
