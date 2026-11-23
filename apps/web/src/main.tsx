import { DirectionProvider, type Locale, ThemeProvider } from "@odyssey/ui";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.js";
import { DesignSystemPage } from "./design-system/page.js";
import i18n from "./i18n.js";
import "./styles/globals.css";

// Register Service Worker for PWA Offline functionality
if (
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  process.env.NODE_ENV === "production"
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("ServiceWorker registration failed:", err);
    });
  });
}

function isDesignSystemRoute(): boolean {
  return (
    typeof window !== "undefined" && window.location.hash.replace(/^#\/?/, "") === "design-system"
  );
}

function Root(): React.JSX.Element {
  const handleLocaleChange = (locale: Locale) => {
    i18n.changeLanguage(locale);
  };
  const showDesignSystem = isDesignSystemRoute();

  return (
    <React.StrictMode>
      <ThemeProvider defaultTheme="light">
        <DirectionProvider defaultLocale="fa" onLocaleChange={handleLocaleChange}>
          {showDesignSystem ? <DesignSystemPage /> : <App />}
        </DirectionProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<Root />);
}
