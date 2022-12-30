import { Menu } from "@headlessui/react";
import { mdiChevronDown } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

export type DropdownProps = {
  icon?: string;
  text?: string;
  menuIcon?: string;
  snapRight?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

export default function Dropdown(props: DropdownProps) {
  const [button, setButton] = useState<HTMLButtonElement | null>(null);
  const [items, setItems] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!button) return;
    if (!items) return;
    const { left, right, bottom } = button.getBoundingClientRect();
    const { width } = items.getBoundingClientRect();
    const side = left + width + 8;

    items.style.left = `${
      props.snapRight
        ? Math.max(0, Math.min(left, Math.max(8, right - width)))
        : Math.max(0, Math.min(left - side + window.innerWidth, left))
    }px`;

    items.style.top = `${bottom + 8}px`;
  }, [button, items, props.snapRight]);

  return (
    <Menu>
      {({ open }) => {
        return (
          <>
            <Menu.Button
              ref={setButton}
              type="button"
              disabled={props.disabled}
              className={twMerge(
                "inline-flex items-center justify-center gap-2 rounded px-3 py-2 text-sm outline-none ring-gray-500 enabled:hover:bg-gray-700 enabled:focus:ring-2 enabled:active:bg-gray-800 disabled:opacity-50",
                props.className
              )}
            >
              {props.icon && <Icon path={props.icon} size={0.75} />}
              {props.text}
              <Icon path={props.menuIcon ?? mdiChevronDown} size={0.75} />
            </Menu.Button>

            {!props.disabled &&
              open &&
              createPortal(
                <Menu.Items
                  ref={setItems}
                  className="absolute grid min-w-[192px] grid-cols-1 divide-y divide-gray-600 rounded-lg border border-gray-600 bg-gray-800 p-2 shadow-lg outline-none [&>div:not(:first-child)]:mt-2 [&>div:not(:first-child)]:pt-2"
                >
                  {props.children}
                </Menu.Items>,
                document.body
              )}
          </>
        );
      }}
    </Menu>
  );
}

export type DropdownItemProps = {
  disabled?: boolean;
  highlighted?: boolean;
  children: ReactNode;
  onClick?: () => void;
};

export function DropdownItem(props: DropdownItemProps) {
  return (
    <Menu.Item disabled={props.disabled}>
      {({ active, disabled }) => {
        return (
          <button
            type="button"
            disabled={disabled}
            className={clsx(
              "flex w-full items-center justify-start gap-2 rounded px-3 py-2 text-sm outline-none ring-gray-500 enabled:hover:bg-gray-700 enabled:focus:ring-2 enabled:active:bg-gray-800 disabled:opacity-50",
              active && "ring-2",
              props.highlighted && "bg-gray-700 font-semibold"
            )}
            onClick={props.onClick}
          >
            {props.children}
          </button>
        );
      }}
    </Menu.Item>
  );
}
