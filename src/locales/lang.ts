import { Constraints } from "../shared.lib/filter-and-sort/filter";
import { TypeLang } from "../shared.lib/locale.lang";
import { ru } from "./def.ru";
//import { en } from "./en";


import ruRu from 'antd/locale/ru_RU';
import ukUA from 'antd/locale/uk_UA';
import enUS from 'antd/locale/en_US';
import { ua } from "./ua";
import { en } from "./en";


export const lang: LangObject = {
  en: en,
  ru: ru,
  ua: ua
}



export const langAntd = {
  en: enUS,
  ru: ruRu,
  ua: ukUA
}


export type Translation = typeof ru

export type LangObject = {
  [K in TypeLang]: Translation;
};


//Класс помощник для выбора сложных типов
export class LocU {
  static getConstraintsLoc<T extends typeof ru>(lan: T | undefined, constraints: Constraints) {
    const t: any = lan?.filter.constraints
    if (!t) throw new Error()
    const tloc = t[constraints]
    if (!tloc) throw new Error()
    return tloc
  }

}

