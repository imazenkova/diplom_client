import { ASINColumns, NoteColumn, colNormalize } from "../../../../../components/table/asin-table-columns";
import { EbayItem } from "../../../../../shared.lib/plugins/ebay-types";
import { aimge } from "./formaters";

export const listEbaycolumns: ASINColumns<EbayItem> = colNormalize([
  { frozen: true, title: 'Img', field: 'loImgs', dataType: 'imgs', width: 80, formatter: aimge, formatterParams: { height: '30px' } },
  NoteColumn,
  { title: 'Ein', field: 'ein', dataType: 'number' },
  { title: 'URL', field: 'url', dataType: 'url', width: '8rem', formatter: 'link' },
  { title: 'Name', field: 'name', dataType: 'string', formatter: 'link', formatterParams: { urlField: 'url' } },
  { title: 'Price', field: 'price', dataType: 'number', formatter: 'money', formatterParams: { symbol: '$' } },
  { title: 'PriceTo', field: 'priceTo', dataType: 'number', formatter: 'money', formatterParams: { symbol: '$' } },
  { title: 'ShipPrice', field: 'shipPrice', dataType: 'number', formatter: 'money', formatterParams: { symbol: '$' } },
  { title: 'Condition', field: 'condition', dataType: 'string' },
  { title: 'Variation', field: 'isVar', dataType: 'boolean', formatter: 'tickCross' },
  { title: 'URL Scan', field: 'urlScan', dataType: 'url', width: '8rem', formatter: 'link' },
]);
