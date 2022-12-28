import "i18next";

import type common from "../../public/locales/en/common.json";

export declare type Common = typeof common;
export declare type CommonKey = keyof Common;

interface I18nNamespaces {
  common: Common;
}

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: I18nNamespaces;
  }
}
