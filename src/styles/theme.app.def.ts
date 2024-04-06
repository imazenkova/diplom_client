import { theme } from 'antd';
import { themeDefAntd } from "./theme.def.antd";

export const themeDef = {
  app: {
    //Ширина сайдера
    siderWidth: '250px',
    //Ширина сайдера
    headerHeight: '3rem',
    headerFuterPaddingLRHeight: '1rem',
    backgroundColor: '#E6E7F1', //Цвет бэкграунда с синевой сделанный из основного цвета  //'rgba(100, 104, 190, 1)',
    backgroundColor2: '#FAFAFD',

    logoPrimaryColor: '#FF9A00', //Цвет логотипа (золотой)

  },
  antd: theme.getDesignToken(themeDefAntd),
  theme: themeDefAntd,
}


//Утилитный класс для CSS
export const CSSU = {
  //Делает арифметические операции и учитывает размерность
  calc: (val: string | number | undefined, oper: (val: number) => number): number | string => {
    if (val === undefined) return ''
    if (typeof val === 'number') return oper(val)
    const value = parseFloat(val);
    const unit = val.replace(value.toString(), ''); // это преобразует '3.5rem' в 'rem'
    return oper(value) + unit
  }
}
