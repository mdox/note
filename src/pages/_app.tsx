import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import { type AppType } from "next/app";
import { useRouter } from "next/router";
import { AfterHydrationProvider } from "../features/AfterHydration/AfterHydration";
import AuthGuard from "../features/AuthGuard/AuthGuard";
import GlobalLoading, {
  GlobalLoadingProvider,
} from "../features/GlobalLoading/GlobalLoading";
import Layout from "../layouts/Layout";
import { EditorProvider } from "../modules/Editor";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
      <AfterHydrationProvider>
        <GlobalLoadingProvider>
          <Layout>
            <EditorProvider>
              <Component {...pageProps} />
            </EditorProvider>
          </Layout>
          <AuthGuard key={router.asPath} />
          <GlobalLoading />
        </GlobalLoadingProvider>
      </AfterHydrationProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(appWithTranslation(MyApp));
