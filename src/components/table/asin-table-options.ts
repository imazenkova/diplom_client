import { Options } from "tabulator-tables";

//https://tabulator.info/docs/5.5/options#default
export const ASIN_TABLE_DEFAULT_OPTIONS: Partial<Options> = {
  //paginationMode: 'local',
  //paginationSize: 5000,
  //movableRows: true,
  movableColumns: true,
};

export type ASINTableOptions = typeof ASIN_TABLE_DEFAULT_OPTIONS
