import type { DocumentProps } from "next/document";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document(props: DocumentProps) {
  const { locale, defaultLocale } = props.__NEXT_DATA__;

  return (
    <Html lang={locale ?? defaultLocale}>
      <Head />
      <body className="overflow-y-scroll bg-gray-900 font-sans text-base text-gray-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
