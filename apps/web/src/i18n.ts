import { enLocale, faLocale } from "@odyssey/ui";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fa: { translation: faLocale },
  en: { translation: enLocale },
};

i18n.use(initReactI18next).init({
  resources,
  lng:
    typeof window !== "undefined" && localStorage.getItem("odyssey_locale") === "en" ? "en" : "fa",
  fallbackLng: "fa",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
