
import { IComparePricesColumns, IRowFormula } from "../../shared.lib/api/task.data";

export type RequiredComparePricesColumns = Required<IComparePricesColumns>

export const emptyComparePricesColumns = (fileName: string): IComparePricesColumns => {
  const res: RequiredComparePricesColumns = {
    $name: fileName,
    $desc: '',
    title: "",
    url: "",
    upc: "",
    ean: "",
    price: "",
    img: "",
    brand: "",
    attr: [],
  }
  return res
};

export type selectItem = {
  label: string;
  value: string;
};

export type DataItem = {
  //Наименование поля
  compare: keyof IComparePricesColumns;
  //Это то что в UI селекторах или мултиселекторах
  upload: string | string[];
  formula: string;
  calcExamp: any;
};

export interface TempResourceValue {
  template: DataItem[];
  fileRows: any[];
}

export function getUniqueKeysFromData(data: any[]) {// получаем уникальные ключи для select (колонка upload)
  const uniqueKeysSet = new Set<string>();

  for (let i = 0; i < Math.min(data.length, 1000); i++) {
    Object.keys(data[i]).forEach(v => uniqueKeysSet.add(v))
  }
  return Array.from(uniqueKeysSet);
}

export const createComparePricesTemplate = (fileName: string, data: DataItem[], keysWithoutDollarSign: string[]): IComparePricesColumns => {//генерация шаблона
  const template: any = emptyComparePricesColumns(fileName)

  keysWithoutDollarSign.forEach((key) => {
    const keyType = key as keyof IComparePricesColumns
    const matchData: DataItem | undefined = data.find((item: DataItem) => item.compare === keyType);

    if (matchData) {
      if (matchData.upload === "formula" && keyType !== "attr") {
        const value: IRowFormula = {
          formula: matchData.formula
        };
        template[keyType] = value;
      } else {
        template[keyType] = matchData.upload;
      }
    }
  });

  return template;
};

