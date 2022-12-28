import type { ReactNode } from "react";

export type PlaceholderProps = {
  children: ReactNode;
};

export default function Placeholder(props: PlaceholderProps) {
  return (
    <div className="pointer-events-none absolute inset-x-3 top-2 inline-block select-none overflow-hidden text-ellipsis whitespace-nowrap opacity-50">
      {props.children}
    </div>
  );
}
