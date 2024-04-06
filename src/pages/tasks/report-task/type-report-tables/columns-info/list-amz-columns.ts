import { ASINColumns, NoteColumn, colNormalize } from "../../../../../components/table/asin-table-columns";
import { AmzItem } from "../../../../../shared.lib/plugins/amz-types";
import { aimge } from "./formaters";


export const listAmzcolumns: ASINColumns<AmzItem> = colNormalize([
  { frozen: true, title: 'Img', field: 'loImgs', dataType: 'imgs', formatter: aimge, formatterParams: { height: '30px' } },
  { title: 'ASIN', field: 'asin', dataType: 'string', width: 100 },
  NoteColumn,
  { title: 'URL', field: 'url', dataType: 'url', width: '8rem', formatter: 'link' },
  { title: 'Name', field: 'title', dataType: 'string', formatter: 'link', formatterParams: { urlField: 'url' } },
  { title: 'Price', field: 'price', dataType: 'number', formatter: 'money', formatterParams: { symbol: '$' } },
  { title: 'PriceTo', field: 'priceTo', dataType: 'number', formatter: 'money', formatterParams: { symbol: '$' } },
  { title: 'ShipPrice', field: 'shipPrice', dataType: 'number', formatter: 'money', formatterParams: { symbol: '$' } },
  { title: 'Rating', field: 'rating', dataType: 'number', formatter: 'star' },
  { title: 'Reviews', field: 'reviews', dataType: 'number' },
  { title: 'DeliveryFrom', field: 'delivery_days_from', dataType: 'number' },
  { title: 'DeliveryTo', field: 'delivery_days_to', dataType: 'number' },
  { title: 'Sold', field: 'soldPlusPastMonth', dataType: 'number' },
  { title: 'URL Scan', field: 'urlScan', dataType: 'url', width: '8rem', formatter: 'link' },
]);
