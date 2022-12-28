import { Menu } from "@headlessui/react";
import { mdiChevronDown } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type DropdownProps = {
  icon?: string;
  text?: string;
  disabled?: boolean;
  children: ReactNode;
};

export default function Dropdown(props: DropdownProps) {
  const [button, setButton] = useState<HTMLButtonElement | null>(null);
  const [items, setItems] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!button) return;
    if (!items) return;
    const { left, bottom } = button.getBoundingClientRect();
    const { width } = items.getBoundingClientRect();
    const side = left + width + 8;
    items.style.left = `${Math.min(left - side + window.innerWidth, left)}px`;
    items.style.top = `${bottom + 8}px`;
  }, [button, items]);

  return (
    <Menu>
      {({ open }) => {
        return (
          <>
            <Menu.Button
              ref={setButton}
              type="button"
              disabled={props.disabled}
              className="inline-flex items-center justify-center gap-2 rounded px-3 py-2 text-sm outline-none ring-inset ring-gray-500 enabled:hover:bg-gray-700 enabled:focus:ring-2 enabled:active:bg-gray-800 disabled:opacity-50"
            >
              {props.icon && <Icon path={props.icon} size={0.75} />}
              {props.text}
              <Icon path={mdiChevronDown} size={0.75} />
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
  highlighted?: boolean;
  children: ReactNode;
  onClick?: () => void;
};

export function DropdownItem(props: DropdownItemProps) {
  return (
    <Menu.Item>
      {({ active }) => {
        return (
          <button
            type="button"
            className={clsx(
              "flex w-full items-center justify-start gap-2 rounded px-3 py-2 text-sm outline-none ring-inset ring-gray-500 enabled:hover:bg-gray-700 enabled:focus:ring-2 enabled:active:bg-gray-800 disabled:opacity-50",
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
