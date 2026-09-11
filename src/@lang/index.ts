import { createI18n } from 'vue-i18n'

import type { LangMessageType, LangType } from './Lang.type'
import { fr } from './fr';
import { en } from './en';
const messages: LangMessageType = {
    fr: fr as LangType,
    en: en as LangType
}
const browserLanguage = navigator.language.split('-')[0];

const defaultLanguage =
    browserLanguage === 'en' ? 'en' : 'fr';
const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem("language") || defaultLanguage,
    fallbackLocale: "fr",
    messages
})

export default i18n