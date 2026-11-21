import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type Locale = "fa" | "en";
export type Direction = "rtl" | "ltr";

interface DirectionContextType {
  locale: Locale;
  direction: Direction;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

export function DirectionProvider({
  children,
  defaultLocale = "fa",
  storageKey = "odyssey_locale",
  onLocaleChange,
}: {
  children: React.ReactNode;
  defaultLocale?: Locale;
  storageKey?: string;
  onLocaleChange?: (locale: Locale) => void;
}): React.JSX.Element {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey) as Locale | null;
      if (stored === "fa" || stored === "en") return stored;
    }
    return defaultLocale;
  });

  const direction: Direction = locale === "fa" ? "rtl" : "ltr";

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("lang", locale === "fa" ? "fa-IR" : "en-US");
    root.setAttribute("dir", direction);
    onLocaleChange?.(locale);
  }, [locale, direction, onLocaleChange]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newLocale);
    }
  };

  const toggleLocale = () => {
    const next: Locale = locale === "fa" ? "en" : "fa";
    setLocale(next);
  };

  return (
    <DirectionContext.Provider value={{ locale, direction, setLocale, toggleLocale }}>
      {children}
    </DirectionContext.Provider>
  );
}

export function useDirection(): DirectionContextType {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error("useDirection must be used within a DirectionProvider");
  }
  return context;
}
