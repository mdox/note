import { twMerge } from "tailwind-merge";

export type ButtonProps = {
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Button({
  disabled,
  className,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={twMerge(
        "inline-flex items-center justify-center gap-2 rounded px-3 py-2 font-semibold outline-none ring-gray-600 enabled:hover:bg-gray-700 enabled:focus:ring-2 enabled:active:bg-gray-800",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
