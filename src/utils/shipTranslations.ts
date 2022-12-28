import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import i18nConfig, { i18n } from "../../next-i18next.config.cjs";

export default function shipTranslations<P>(
  child?: (
    ctx: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return async (ctx: GetServerSidePropsContext) => {
    const translations = await serverSideTranslations(
      ctx.locale ?? i18n.defaultLocale,
      ["common"],
      i18nConfig
    );

    if (!child) {
      return {
        props: { ...translations } as P,
      };
    }

    const result = await child(ctx);

    if (Object.hasOwn(result, "props")) {
      const props = (result as { props: P | Promise<P> }).props;

      return {
        props: {
          ...translations,
          ...(await props),
        },
      };
    } else {
      return result;
    }
  };
}
