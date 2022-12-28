import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useState,
} from "react";

type ContextType = {
  isHydrated: boolean;
};

const Context = createContext<ContextType | null>(null);

export function AfterHydrationProvider({ children }: React.PropsWithChildren) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    return () => {
      setIsHydrated(false);
    };
  }, []);

  return <Context.Provider value={{ isHydrated }}>{children}</Context.Provider>;
}

export function AfterHydration({ children }: React.PropsWithChildren) {
  const context = useContext(Context);

  if (context === null)
    throw new Error(
      "Context is not initialized. Use `AfterHydrationProvider`."
    );

  const { isHydrated } = context;

  if (!isHydrated) return null;

  if (Children.count(children) === 1)
    return isValidElement(children) ? children : null;
  return <>{children}</>;
}
