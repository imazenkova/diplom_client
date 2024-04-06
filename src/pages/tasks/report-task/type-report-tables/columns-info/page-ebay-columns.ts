import { ASINColumns, NoteColumn, colNormalize } from "../../../../../components/table/asin-table-columns";
import { IComparePricesColumns } from "../../../../../shared.lib/api/task.data";
import { EbayPage } from "../../../../../shared.lib/plugins/ebay-types";
import { aimge } from "./formaters";

//Коолнки связаны поэтом меняем вместе
export const defComparePricesEBay: IComparePricesColumns = {
  $name: 'eBay pages',
  upc: 'UPC',
  ean: 'EAN',
  brand: 'Brand',
  img: 'Img',
  price: {formula: `@(Price) + @(ShipPrice)`},
  url: 'Url',
  title: 'Name',
  attr: ['Count', 'DFrom', 'DTo', 'Condition']
}

export let pageEbayColumns: ASINColumns<EbayPage> = colNormalize([
  { title: 'Img', frozen: true, field: 'loImgs', dataType: 'imgs', width: 80, formatter: aimge, formatterParams: { height: '30px' } },
  NoteColumn,
  { title: 'EIN', field: 'ein', dataType: 'string' },
  { title: 'Url', field: 'url', dataType: 'url', width: '8rem', formatter: 'link' },
  { title: 'Name', field: 'name', dataType: 'string', width: '30rem', formatter: 'link', formatterParams: { urlField: 'url' } },
  { title: 'Brand', field: 'brand', dataType: 'string', width: '10rem' },
  { title: 'Status', field: 'status', dataType: 'string', width: '8rem' },
  { title: 'UPC', field: 'upc', dataType: 'string' },
  { title: 'EAN', field: 'ean', dataType: 'string' },
  { title: 'MPN', field: 'mpn', dataType: 'string', width: '15rem' },
  { title: 'NumPie', field: 'numberOfPieces', dataType: 'number', headerTooltip: 'Number Of Pieces', width: '5rem' },
  { title: 'NumSold', field: 'sold', dataType: 'number', headerTooltip: 'Number Of Sold' },
  { title: 'Is VAR', field: 'isVar', dataType: 'boolean', formatter: 'tickCross', headerTooltip: 'Is Variation' },
  { title: 'Count', field: 'count', dataType: 'number' },
  { title: 'Price', field: 'price', dataType: 'number', formatter: 'money', formatterParams: { symbol: '$' } },
  { title: 'ShipPrice', field: 'shipPrice', dataType: 'number', formatter: 'money', formatterParams: { symbol: '$' } },
  { title: 'Location', field: 'location', dataType: 'string' },
  { title: 'Condition', field: 'condition', dataType: 'string' },
  { title: 'DFrom', field: 'deliveryFrom', dataType: 'number', headerTooltip: 'deliveryFrom' },
  { title: 'DTo', field: 'deliveryTo', dataType: 'number', headerTooltip: 'deliveryFrom' },
  { title: 'Sel:Url', field: 'selUrl', dataType: 'url', width: '8rem', formatter: 'link' },
  { title: 'Sel:ID', field: 'selId', dataType: 'string', formatter: 'link', formatterParams: { urlField: 'selUrl' } },
  { title: 'Sel:Name', field: 'selName', dataType: 'string' },
  { title: 'Sel:Feedback', field: 'selFeedbackCount', dataType: 'number', headerTooltip: 'Seller Feedback Count' },
  { title: 'Sel:Rating', field: 'selFeedback', dataType: 'number', formatter: 'star', headerTooltip: 'Seller Feedback Positive' },
  { title: 'Sel:Sold', field: 'selSold', dataType: 'number' },
  { title: 'HiImgs', field: 'hiImgs', dataType: 'string', formatter: 'link', width: '8rem', },
]);
