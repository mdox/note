import Link from "next/link";
import type { ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <header className="bg-gray-800 p-2">
        <nav className="mx-auto max-w-screen-md">
          <Link href="/" className="font-quicksand text-3xl">
            CO-NOTE
          </Link>
        </nav>
      </header>

      <div className="p-2">
        <main className="mx-auto max-w-screen-md">{children}</main>
      </div>
    </>
  );
}
