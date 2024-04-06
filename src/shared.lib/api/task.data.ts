import { AmzItem, AmzPage } from '../plugins/amz-types'
import { EbayItem, EbayPage } from '../plugins/ebay-types'

//------------- Amazon--------------------
export type AmzLocationType = 'com'

export interface IReadAsinsAMZ {
  asins: string[]
  location: AmzLocationType
}
export type IReadAsinsAMZResult = AmzPage[]

export interface IReadUrlsAMZ {
  urls: string[]
  location: AmzLocationType
}
export type IReadUrlsAMZResult = AmzPage[]


export interface IReadListFromUrlAMZ {
  url: string
  location: AmzLocationType
}
export type IReadListFromUrlAMZResult = AmzItem[]

//------------- eBay--------------------
export interface IReadUrlsEbay {
  urls: string[]
}

export type IReadUrlsEbayResult = EbayPage[]


export interface IReadListFromUrlEbay {
  url: string
}

export type IReadListFromUrlEbayResult = EbayItem[]

//------------- WB--------------------
export const WBDESTValues = [
  "MOSCOW", //Первый не трогаем добавляем в конец
  "KRASNODAR",
  "KAZAHSTAN",
  "HABAROVSK",
  "NOVOSIBIRSK",
  "EKATERINBURG",
  "MINSK",
] as const;

export type WBDEST = typeof WBDESTValues[number];

export type MODE_QFILTER_WB = 'skuWB' | 'suplierId' | 'nop'

export type SKUWB_QUERY = {
  skuWB: number,
  skuSupl?: string,
}

export interface QueryFilterWB {
  mode: MODE_QFILTER_WB
  //ID поставщика
  supplier?: number[],
  skuWB?: SKUWB_QUERY[]
}

export interface IPosListFromQueryWB {
  queries: string[],
  //Глубина чтения
  deepRead?: number,
  dest?: WBDEST,
  filter?: QueryFilterWB
}

export interface IExistListFromQuerySuplWB {
  queries: string[],
  dest?: WBDEST,
  supplier: number //Находим по поставщику
}

export interface IReadListFromQueryWB extends Pick<IPosListFromQueryWB, 'queries' | 'dest' | 'deepRead'> { }

//------------- TestTask--------------------
//Создан для тестирования алгоритмов работы
export interface IReadTestTask {
  //Время от до для срабатывания каждой еденицы в задании если задан один параметр значит точное время выполнение
  timoutStepMs: [number, number?]
  //Количество шагов в задании
  numberofStep: number
}

//Создан для тестирования алгоритмов работы по юнитам и распределенных заданий
export interface IReadTestUnits {
  units:
  {
    //Время от до для срабатывания каждой еденицы в задании если задан один параметр значит точное время выполнение
    timoutStepMs: [number, number?]
  }[]
}
export interface IRowFormula {
  formula: string
}

//-------------------------------------------
export interface IComparePricesColumns {
  //служебное название конфигурации
  $name: string,
  $desc?: string,
  title: string | IRowFormula,
  url: string | IRowFormula,
  upc: string | IRowFormula,
  ean: string | IRowFormula,
  price: string | IRowFormula,
  img: string | IRowFormula,
  brand: string | IRowFormula,
  attr: string[]
}

type ConvertToSimpleString<T> = {
  [K in keyof T]: T[K] extends string | IRowFormula ? string : T[K];
};

type IComparePricesColumnsRes = Omit<ConvertToSimpleString<IComparePricesColumns>, 'price' | 'attr'>
  & { price: number, attr: string };

export interface IComparePricesWithKeepa {
  comparerField: (keyof IComparePricesColumns)[],
  //Выводить в выходной файл все поля без фильтрации на comparerField
  isAllOut?: boolean,
  supplier: {
    fileName: string,
    csv?: {
      delimeter: string
    },
    xlsx?: {},
    columns: IComparePricesColumns,
  }[],
  keepa: {
    fileName: string,
  }
}

export class CalcNotAsignError extends Error {
  constructor(public key: string, public val: string, public indx: number) { super() }
}

const getErrMsg = (err: unknown): string => {
  if (err instanceof Error) return err.message
  else return `${err}`
}

export const isRowFormula = (rowFormula: any): boolean => {
  return (typeof rowFormula === 'object' && rowFormula !== null && 'formula' in rowFormula)
}

const formulaRegEx = /@\(([^)]+)\)/g
export const getValuesFormula = (rowFormula: IRowFormula): string[] => {
  const matches = rowFormula.formula.match(formulaRegEx)

  if (matches) {
    return matches.map(match => match.replace(formulaRegEx, '$1'));
  } else {
    return [];
  }
}

export const calcRowFormula = (comparePricesColumns: IComparePricesColumns, rowSuplier: any[], exceptionMode: boolean = true): IComparePricesColumnsRes[] => {
  const formulaData = (formula: string): Function => {
    // eslint-disable-next-line no-new-func
    return new Function('row', `
  try {
    const result = ${formula}
    return result
  }
  catch(e) {
    throw e
  }`)
  }

  const entries = Object.entries(comparePricesColumns)
  const mapFunc = new Map<string, Function>()
  for (let i = 0; i < entries.length; i++) {
    const [key, val] = entries[i]
    if (isRowFormula(val)) {
      let formula
      try {
        formulaRegEx.lastIndex = 0
        formula = formulaData(val.formula.replace(formulaRegEx, "row['$1']"));
      } catch (error) {
        formula = formulaData(`""`);
      }
      mapFunc.set(key, formula)
    }
  }

  const res: IComparePricesColumnsRes[] = []

  const cval = (key: string, val: string, i: number) => {
    if (val === '') {
      return ''
    } else if (rowSuplier[i][val] === undefined) {
      if (exceptionMode) throw new CalcNotAsignError(key, val, i)
      else return `${key}: ${val} - ${i}`
    }
    return rowSuplier[i][val]
  }

  for (let i = 0; i < rowSuplier.length; i++) {
    const r: any = {}
    for (let n = 0; n < entries.length; n++) {
      const [key, val] = entries[n]
      try {
        if (key.startsWith('$')) {
          r[key] = val
        }
        else if (typeof val === 'string') {
          r[key] = cval(key, val, i)
        } else if (mapFunc.has(key)) {
          const func = mapFunc.get(key)!
          try {
            r[key] = func(rowSuplier[i])
          } catch (err) {
            r[key] = getErrMsg(err)
          }
        } else if (Array.isArray(val)) {
          r[key] = ''
          val.forEach((v3, l) => {
            if (l > 0) r[key] += '; '
            r[key] += `${v3}:${cval(key, v3, i)}`
          })
        }
      } catch (err) {
        r[key] = getErrMsg(err)
      }
    }

    res.push(r)
  }
  return res
}
