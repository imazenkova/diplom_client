import { ColumnDefinition } from "tabulator-tables";
import { LocState } from "../../Reduser";
import { colorPrimary } from "../../pages/tasks/report-task/type-report-tables/columns-info/formaters";
import { ITaskInfoRes } from "../../shared.lib/api/task.api";

export type DataType = 'string' | 'number' | 'boolean' | 'date' | 'imgs' | 'url' | 'serv';

export interface ASINColumn<T = any> extends Pick<ColumnDefinition,
  "title" | "width" | "headerTooltip" | "maxWidth" | "cssClass" |
  "formatter" | 'formatterParams' |
  "frozen" | "mutator" | "download"> {
  dataType: DataType; // serv - сервисный тип колонки например для выделения или любой другой тип, который вы хотите поддерживать
  field: T extends unknown ? keyof T : string
}


export type ASINColumns<T = any> = ASINColumn<T>[]

export type ColCreatorType<T> = (loc: LocState, data?: ITaskInfoRes) => ASINColumns<T>

//Количество служебных колонок начиная с 0
export const SERV_COLUMN = 1

export const NoteColumn: ColumnDefinition & ASINColumn = {
  title: 'Note', field: 'note', editor: 'input', dataType: 'string', width: 70, formatter: colorPrimary,
  headerContextMenu: [
    {
      label: "Copy",
      action: (e, column) => {
        const c = column.getCells().map(v => v.getValue()).join('\n')
        navigator.clipboard.writeText(c);
      }
    }
  ]
}

const getHashId = (inp: ASINColumn): string => {
  return `${inp.field as string}-${inp.dataType}-${inp.title}`
}

export const colNormalize = <T>(inp: ASINColumns<T>): ASINColumns<T> => {
  for (let i = 0; i < inp.length; i++) {
    const row = inp[i] as ColumnDefinition
    row.headerWordWrap = true
    row.headerHozAlign = 'center'
    row.vertAlign = 'middle'

    if (inp[i].dataType === 'imgs') row.headerSort = false

    if (inp[i].dataType === 'number') {
      row.hozAlign = 'right'; // Выравнивание числовых данных по правому краю
    }

    if (row.formatter === 'link') {
      row.formatterParams = { target: '_blank', ...row.formatterParams }
    }

    if (!row.formatterParams) (row.formatterParams as any) = {} as any
    (row.formatterParams as any).$asin_row_id = getHashId(inp[i])
  }

  let servCol: ColumnDefinition & ASINColumn = {
    title: '', formatter: "rowSelection", formatterParams: { rowRange: 'selected' }, frozen: true, titleFormatter: "rowSelection", hozAlign: "center", headerSort: false,
    field: '$chk', download: false, dataType: 'serv'
  }

  let numCol: ColumnDefinition & ASINColumn = {
    title: 'ID', field: 'id', dataType: 'number', frozen: true,
  }

  const res: ASINColumns = [
    servCol,
    numCol as ASINColumn,
    ...inp
  ]

  return res as ASINColumns<T>
}


export const createDefColumn = (data: any[], useImg: boolean = false): ColumnDefinition[] => {
  const map = new Map<string, string>();
  data.forEach(row => {
    Object.entries(row).forEach(kv => {
      const val = map.get(kv[0]);
      const newval = String(kv[1]);
      if (val) {
        if (val.length < newval.length) {
          map.set(kv[0], newval);
        }
      } else {
        map.set(kv[0], newval);
      }
    });
  });

  const columns: ColumnDefinition[] = [];
  map.forEach((value, key) => {
    let width = value.length > 35 ? '21rem' : undefined; //21rem = 35символов
    let formatter: "link" | "image" | "number" | undefined = undefined;
    let formatterParams: any = {};

    if (value.startsWith("http://") || value.startsWith("https://")) {
      if (useImg && (value.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) != null)) {
        formatter = "image";
        width = '10rem'
        formatterParams = { height: '30px' }
      } else {
        formatter = "link";
        formatterParams.target = "_blank";
      }
    } else if (!isNaN(Number(value))) {
      //С цифрами не совсем понятно т.к. UPC тоже становится цифрой и разделяется запятой что не допустимо
      //formatter = "number"; // используйте "number" как пример числового форматтера
    }

    const column: ColumnDefinition = {
      title: key,
      field: key,
    };
    if (width) column.width = width

    if (formatter) {
      column.formatter = formatter;
      column.formatterParams = formatterParams;
    }

    columns.push(column);
  });

  delete columns[columns.length - 1].width
  return columns;
};
