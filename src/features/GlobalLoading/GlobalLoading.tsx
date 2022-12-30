import { mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import { useIsFetching, useIsRestoring } from "@tanstack/react-query";
import clsx from "clsx";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type GlobalLoadingContextType = {
  use: number;
  increase: () => void;
  decrease: () => void;
};

const GlobalLoadingContext = createContext<GlobalLoadingContextType | null>(
  null
);

export function GlobalLoadingProvider({ children }: React.PropsWithChildren) {
  const [use, setUse] = useState(0);

  const ref = useRef(use);

  ref.current = use;

  const value: GlobalLoadingContextType = useMemo(
    () => ({
      use,
      increase: () => setUse(ref.current + 1),
      decrease: () => setUse(ref.current - 1),
    }),
    [use]
  );

  return (
    <GlobalLoadingContext.Provider value={value}>
      {children}
    </GlobalLoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);

  if (context === null) throw new Error("No context.");

  const { use, increase, decrease } = context;

  return {
    use,
    wrap: function <T>(promise: Promise<T>) {
      increase();
      return promise.then(() => {
        decrease();
        return promise;
      });
    },
  };
}

export default function GlobalLoading() {
  const isFetching = useIsFetching();
  const isMutating = useIsFetching();
  const isRestoring = useIsRestoring();
  const globalLoading = useGlobalLoading();

  const [show, setShow] = useState(false);

  const isLoading =
    isFetching > 0 || isMutating > 0 || isRestoring || globalLoading.use > 0;

  useEffect(() => {
    if (isLoading) return setShow(true);
    const timeout = setTimeout(() => {
      setShow(false);
    }, 350);
    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading]);

  if (!show && !isLoading) return null;

  return createPortal(
    <div className="fixed inset-0 flex justify-center bg-gray-900 opacity-50">
      <div className="absolute top-1/3 h-16 w-16 origin-center animate-spin">
        {Array.from({ length: 4 }).map((_, index) => (
          <span
            key={index}
            className={clsx(
              "absolute flex animate-pulse items-center justify-center  ",
              [
                "left-0 top-0 rotate-0",
                "right-0 top-0 rotate-90",
                "right-0 bottom-0 rotate-180",
                "left-0 bottom-0 -rotate-90",
              ][index]
            )}
          >
            <Icon path={mdiLoading} size={2} spin={4} />
            {Array.from({ length: 4 }).map((_, index) => (
              <span
                key={index}
                className={clsx(
                  "absolute flex items-center justify-center",
                  [
                    "left-0 top-0 rotate-0",
                    "right-0 top-0 rotate-90",
                    "right-0 bottom-0 rotate-180",
                    "left-0 bottom-0 -rotate-90",
                  ][index]
                )}
              >
                <Icon path={mdiLoading} size={1.5} spin={-32} />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>,
    document.body
  );
}
