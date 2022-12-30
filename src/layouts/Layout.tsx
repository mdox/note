import { mdiLogout } from "@mdi/js";
import Icon from "@mdi/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import type { ReactNode } from "react";
import Button from "../components/Button";

export type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <header className="bg-gray-800 p-2">
        <nav className="mx-auto flex max-w-screen-md justify-between">
          <Link href="/" className="font-quicksand text-3xl">
            CO-NOTE
          </Link>
          <Button className="p-2" onClick={() => signOut()}>
            <Icon path={mdiLogout} size={0.875} />
          </Button>
        </nav>
      </header>

      <div className="p-2">
        <main className="mx-auto max-w-screen-md">{children}</main>
      </div>
    </>
  );
}
