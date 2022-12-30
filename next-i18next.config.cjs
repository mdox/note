/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

/** @type {import('next-i18next').UserConfig} */
const i18nConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "hu"],
  },

  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/locales",

  reloadOnPrerender: process.env.NODE_ENV === "development",

  react: { useSuspense: false },
};

module.exports = i18nConfig;
