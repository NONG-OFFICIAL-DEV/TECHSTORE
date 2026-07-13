"use client";

import * as React from "react";
import { Locale, Dictionary, dictionaries } from "@/lib/i18n/translations";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "techstore-locale";

// Same useSyncExternalStore idiom as useHasMounted: localStorage is
// invisible to the server, so the server/client-hydration snapshot is
// always "en", and the real stored value takes over right after — without
// a setState-in-effect render cascade.
const listeners = new Set<() => void>();

function readLocale(): Locale {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "km" ? stored : "en";
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getServerSnapshot(): Locale {
  return "en";
}

function writeLocale(next: Locale) {
  window.localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach((listener) => listener());
}

function getNestedValue(dictionary: Dictionary, path: string[]): unknown {
  return path.reduce<unknown>(
    (acc, key) =>
      acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined,
    dictionary
  );
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = React.useSyncExternalStore(subscribe, readLocale, getServerSnapshot);

  React.useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = React.useCallback((next: Locale) => {
    writeLocale(next);
  }, []);

  const toggleLocale = React.useCallback(() => {
    writeLocale(readLocale() === "en" ? "km" : "en");
  }, []);

  const t = React.useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const value = getNestedValue(dictionaries[locale], key.split("."));
      if (typeof value !== "string") return key;
      return interpolate(value, vars);
    },
    [locale]
  );

  const value = React.useMemo(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
