import { DirectionProvider, type Locale, ThemeProvider } from "@odyssey/ui";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.js";
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

function Root(): React.JSX.Element {
  const handleLocaleChange = (locale: Locale) => {
    i18n.changeLanguage(locale);
  };

  return (
    <React.StrictMode>
      <ThemeProvider defaultTheme="light">
        <DirectionProvider defaultLocale="fa" onLocaleChange={handleLocaleChange}>
          <App />
        </DirectionProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<Root />);
}
