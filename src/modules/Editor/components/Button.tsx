import clsx from "clsx";
import type { ReactNode } from "react";

export type ButtonProps = {
  dim?: boolean;
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
};

export default function Button(props: ButtonProps) {
  return (
    <button
      type="button"
      disabled={props.disabled}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded px-3 py-2 outline-none ring-inset ring-gray-500 enabled:hover:bg-gray-700 enabled:focus:ring-2 enabled:active:bg-gray-800 disabled:opacity-50",
        props.dim && "opacity-50"
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
