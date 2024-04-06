import { ASINColumns, NoteColumn, colNormalize } from "../../../../../components/table/asin-table-columns";
import { AmzPage, AmzSeller } from "../../../../../shared.lib/plugins/amz-types";
import { aimge } from "./formaters";

interface AmzSellerEx extends AmzSeller {
  full_price: boolean
}

export const pageAmzSellerColumns: ASINColumns<AmzSellerEx> = colNormalize([
  { title: 'Num', field: 'num', dataType: 'number' },
  { title: 'Seller name', field: 'sellerName', dataType: 'string' },
  { title: 'Seller ID', field: 'sellerId', dataType: 'string' },
  { title: 'Price', field: 'price', dataType: 'number', formatter: 'money' },
  { title: 'Delivery Price', field: 'delivery_price', dataType: 'number' },
  { title: 'Full Price', field: 'full_price', dataType: 'number', formatter: 'money', mutator: (val, data: AmzSellerEx) => data.price + data.delivery_price },
  { title: 'Condition', field: 'condition', dataType: 'string' },
  { title: 'Stock', field: 'count_stock', dataType: 'number' },
  { title: 'DeliveryFrom', field: 'delivery_days_from', dataType: 'number' },
  { title: 'DeliveryTo', field: 'delivery_days_to', dataType: 'number' },
  { title: 'Feedback', field: 'selFeedbackCount', dataType: 'number', headerTooltip: 'Seller Feedback Count' },
  { title: 'Rating', field: 'selFeedback', dataType: 'number', formatter: 'star', headerTooltip: 'Seller Feedback Positive' },
  { title: 'IsFBA', field: 'isFBA', dataType: 'boolean', formatter: 'tickCross' }
]);

export const pageAmzColumns: ASINColumns<AmzPage> = colNormalize([
  { frozen: true, title: 'Product Images', field: 'productImages', dataType: 'imgs', width: 80, formatter: aimge, formatterParams: { height: '30px' } },
  NoteColumn,
  { title: 'ASIN', field: 'asin', dataType: 'string', width: 100 },
  { title: 'URL', field: 'url', dataType: 'url', width: '10px', formatter: 'link' },
  { title: 'Title', field: 'title', dataType: 'string', formatter: 'link', formatterParams: { urlField: 'url' } },
  { title: 'Category', field: 'category', dataType: 'string' },
  { title: 'Brand', field: 'brand', dataType: 'string' },
  { title: 'UPC', field: 'upc', dataType: 'string' },
  { title: 'MPN', field: 'mpn', dataType: 'string' },
  { title: 'Rating', field: 'rating', dataType: 'number', formatter: 'star' },
  { title: 'Reviews', field: 'reviews', dataType: 'number' },
  { title: 'TOP BSR', field: 'topBsr', dataType: 'number', formatter: 'money', formatterParams: { precision: 1 } },
  { title: 'BSR', field: 'bsr', dataType: 'number' },
  { title: 'Is Prime', field: 'isPrime', dataType: 'boolean', formatter: 'tickCross' },
  { title: 'Currency', field: 'currency', dataType: 'string' },
  { title: 'Sellers', field: 'sellers', dataType: 'number' },
  { title: 'FBA Sellers', field: 'fbaSellers', dataType: 'number' },
  { title: 'FBM Sellers', field: 'fbmSellers', dataType: 'number' },
  { title: 'Sales Per Month', field: 'salesImMonth', dataType: 'number' },
  { title: 'Product Dimensions', field: 'prodDimensions', dataType: 'number' },
  { title: 'Item Weight', field: 'itemWeight', dataType: 'number' },
  { title: 'Package Dimensions', field: 'packageDimensions', dataType: 'number' },
  { title: 'Shipping Weight', field: 'shippingWeight', dataType: 'number' },
  { title: 'Buy Box', field: 'buyBox', dataType: 'boolean', formatter: 'tickCross' },
  { title: 'Price', field: 'price', dataType: 'number', formatter: 'money', formatterParams: { symbol: '$' } },
  { title: 'Delivery Price', field: 'delivery_price', dataType: 'number' },
  { title: 'OutOfStock', field: 'outOfStock', dataType: 'boolean', formatter: 'tickCross' },
  { title: 'Variations', field: 'variations', dataType: 'boolean', formatter: 'tickCross' },
  { title: 'Sold By Amazon', field: 'soldByAmazon', dataType: 'boolean', formatter: 'tickCross' },
  { title: 'Url Scan', field: 'urlScan', dataType: 'url', width: '10px', formatter: 'link' },
]);
