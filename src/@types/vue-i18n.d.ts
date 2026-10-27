import type { LangType } from "../@lang/Lang.type";


declare module "vue-i18n" {
    export interface DefineLocaleMessage extends LangType { }
}