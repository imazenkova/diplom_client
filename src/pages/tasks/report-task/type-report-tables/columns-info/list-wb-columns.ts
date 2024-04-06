import { ASINColumns, NoteColumn, colNormalize } from "../../../../../components/table/asin-table-columns";
import { WBApiItem } from "../../../../../shared.lib/plugins/wb-types";
import { getImageURLWB } from "./exist-list-from-query-supl-wb-columns";
import { adate, aimge } from "./formaters";

interface WBApiItemEx extends WBApiItem {
  imgs: string[]
  isAD: boolean
  date: Date,
  url: string
  urlSeller: string
}

export const listWbColumns: ASINColumns<WBApiItemEx> = colNormalize([
  { frozen: true, title: 'Img', field: 'imgs', dataType: 'imgs', width: 80, formatter: aimge, formatterParams: { height: '30px' }, mutator: (val, data: WBApiItemEx) => [getImageURLWB(data.skuWB, 1)] },
  NoteColumn,
  { title: 'Date', field: 'date', dataType: 'date', formatter: adate, formatterParams: { outputFormat: 'date' }} ,
  { title: 'Query', field: 'query', dataType: 'number' },
  { title: 'Pos', field: 'pos', dataType: 'number' },
  { title: 'Name', field: 'name', dataType: 'string', formatter: 'link', formatterParams: { urlField: 'url' } },
  { title: 'SKU', field: 'skuWB', dataType: 'number' },
  { title: 'Brand', field: 'brand', dataType: 'number' },
  { title: 'Delivery hour', field: 'delivTime', dataType: 'number' },
  { title: 'feedbacks', field: 'feedbacks', dataType: 'number' },
  { title: 'Rating', field: 'rating', dataType: 'number' },
  { title: 'Price ₽', field: 'priceSale', dataType: 'number'},
  { title: 'PriceFull ₽', field: 'priceFull', dataType: 'number' },
  { title: 'Discount %', field: 'discount', dataType: 'number' },
  { title: 'IsAD', field: 'isAD', dataType: 'boolean', formatter: 'tickCross', mutator: (val, data: WBApiItemEx) => data.adFrom > 0 },
  { title: 'ADFrom', field: 'adFrom', dataType: 'number' },
  { title: 'ADTo', field: 'adTo', dataType: 'number' },
  { title: 'ADCPM', field: 'adCpm', dataType: 'number' },
  { title: 'supplier', field: 'supplier', dataType: 'string', formatter: 'link', formatterParams: { urlField: 'urlSeller' } },
  { title: 'supplierId', field: 'supplierId', dataType: 'number' },
  { title: 'supplierRating', field: 'supplierRating', dataType: 'number' },
  { title: 'url', field: 'url', dataType: 'string', mutator: (val, data: WBApiItemEx) => `https://www.wildberries.ru/catalog/${data.skuWB}/detail.aspx`, formatter: 'link' },
  { title: 'UrlSeller', field: 'urlSeller', dataType: 'string', mutator: (val, data: WBApiItemEx) => `https://www.wildberries.ru/seller/${data.supplierId}`, formatter: 'link' },

  { title: '$Root', field: 'root', dataType: 'number' },
]);
