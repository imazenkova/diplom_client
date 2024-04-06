import { ColCreatorType, NoteColumn, colNormalize } from "../../../../../components/table/asin-table-columns";
import { KeepaComparePrices } from "../../../../../shared.lib/plugins/keepa-setting";
import { adate, aimge } from "./formaters";

interface KeepaComparePricesEx extends KeepaComparePrices {
  eqBrand: boolean
  pricesPerc: number
  amz_url: string
}

function percPrices(value: any, data: KeepaComparePricesEx): Number {
  if (!data.spl_price || !data.amz_price) return 0;
  return Math.floor((data.amz_price / data.spl_price) * 100);
}

export const comparePricesKeepaColumns: ColCreatorType<KeepaComparePricesEx> = (loc) =>
  colNormalize([
    { title: 'Img Amz', frozen: true, field: 'amz_img', dataType: 'imgs', width: 80, formatter: aimge, formatterParams: { height: '30px' } },
    { title: 'Img Spl', frozen: true, field: 'spl_img', dataType: 'imgs', formatter: aimge, formatterParams: { height: '30px' } },
    {
      title: 'Keepa', field: 'asin', dataType: 'imgs', formatter: aimge, width: 133,
      formatterParams: {
        height: '45px',
        urlPrefix: 'https://graph.keepa.com/pricehistory.png?asin=',
        urlSuffix: '&domain=com&amazon=1&new=1&used=0&salesrank=1&bb=0&fbm=0&fba=0&ld=1&wd=1&range=90&review=1&width=1000&height=400'
      }
    },
    NoteColumn,
    {
      title: 'EQ Brand', field: 'eqBrand', dataType: 'boolean', width: 30, formatter: 'tickCross', mutator: (v, d) => {
        const amz_brand = (typeof d.amz_brand === 'string') ? d.amz_brand?.toLowerCase() : d.amz_brand
        const spl_brand = (typeof d.spl_brand === 'string') ? d.spl_brand?.toLowerCase() : d.spl_brand
        return amz_brand === spl_brand
      }
    },
    { title: 'Prices %', field: 'pricesPerc', dataType: 'number', width: 70, mutator: percPrices, },
    { title: 'Price AMZ', field: 'amz_price', dataType: 'number', width: 70, formatter: "money", formatterParams: { symbol: '$', precision: 2 } },
    { title: 'Price SPL', field: 'spl_price', dataType: 'number', width: 70, formatter: "money", formatterParams: { symbol: '$', precision: 2 } },
    { title: 'Set AMZ', field: 'amz_set', dataType: 'string', width: 40 },
    { title: 'Drop30 AMZ', field: 'amz_bsr_d30', dataType: 'number', width: 70 },
    { title: 'TOP BSR AMZ', field: 'amz_topbsr', dataType: 'number', width: 70, formatter: 'money', formatterParams: { precision: 1 } },
    { title: 'Review 30 AMZ', field: 'amz_review30', dataType: 'number', width: 70 },
    { title: 'Rating AMZ', field: 'amz_rating', dataType: 'number', width: 70 },
    { title: 'FBA count', field: 'amz_offer_cFBA', dataType: 'number', width: 60 },
    { title: 'FBM count', field: 'amz_offer_cFBM', dataType: 'number', width: 60 },
    { title: 'ALL count', field: 'amz_offer_c30', dataType: 'number', width: 60 },
    { title: 'URL AMZ', field: 'amz_url', dataType: 'string', width: 30, formatter: 'link', mutator: (v, d) => `https://amazon.com/dp/${d.asin}` },
    { title: 'URL SPL', field: 'spl_url', dataType: 'string', width: 30, formatter: 'link' },
    { title: 'Title AMZ', field: 'amz_title', dataType: 'string', width: 250, formatter: 'link', formatterParams: { urlField: 'amz_url' } },
    { title: 'Title SPL', field: 'spl_title', dataType: 'string', width: 250, formatter: 'link', formatterParams: { urlField: 'spl_url' } },
    { title: 'Model AMZ', field: 'amz_model', dataType: 'string', width: 150 },
    { title: 'Since AMZ', field: 'amz_since', dataType: 'date', formatter: adate, formatterParams: { outputFormat: 'date' } },
    { title: 'Weight AMZ', field: 'amz_weight', dataType: 'number', width: 70 },
    { title: 'Brand AMZ', field: 'amz_brand', dataType: 'string' },
    { title: 'Brand SPL', field: 'spl_brand', dataType: 'string' },
    { title: 'Categories AMZ', field: 'amz_categories', dataType: 'string' },
    { title: 'ASIN', field: 'asin', dataType: 'string', width: 100 },
    { title: 'Drop90 AMZ', field: 'amz_bsr_d90', dataType: 'number', width: 70 },
    { title: 'Manufacture AMZ', field: 'amz_manuf', dataType: 'string' },
    { title: 'PackQual AMZ', field: 'amz_pack_qual', dataType: 'number', width: 70 },
    { title: 'Attr', field: 'spl_attr', dataType: 'string', width: 150 },
    { title: 'Name', field: 'tName', dataType: 'string', width: 80 },
    { title: 'UPC', field: 'upc', dataType: 'string', width: 90 },
    { title: 'EAN', field: 'ean', dataType: 'string', width: 90 },
  ]);
