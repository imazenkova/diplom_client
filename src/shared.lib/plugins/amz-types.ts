
export interface AmzSeller {
  num: number
  price: number
  delivery_price: number
  sellerName: string
  sellerId: string
  isFBA: boolean
  condition: string
  count_stock: number
  delivery_days_from: number
  delivery_days_to: number
  selFeedbackCount: number,
  selFeedback: number
}

export interface AmzPage {
  asin: string, //+
  //Входной параметр что задавали для сканирования
  urlScan: string,
  //Ссылка на странуцу
  url: string, //+
  title: string,//+
  category: string,//+
  brand: string,//+
  upc: string,
  mpn: string, //+
  rating: number, //+
  reviews: number, //+
  bsr: number, //+
  topBsr: number, //+
  isPrime: boolean,
  currency: string, //+
  sellers: number,
  fbaSellers: number,
  fbmSellers: number,
  salesImMonth: number,
  prodDimensions: string, //+
  itemWeight: string, //+
  packageDimensions: string,
  shippingWeight: string,
  buyBox: boolean,
  //Цена первого селлера или байбокса
  price: number,
  delivery_price: number
  outOfStock: boolean,
  variations: boolean,
  soldByAmazon: boolean,
  productImages: string[], //+
  sellersInfo: AmzSeller[]
}

export interface AmzItem extends Pick<AmzPage, 'asin' | 'urlScan' | 'title' | 'url' | 'price' | 'rating' | 'reviews'>,
  Pick<AmzSeller, 'delivery_days_from' | 'delivery_days_to' | 'delivery_price'> {
  loImgs: string[]
  priceTo: number
  soldPlusPastMonth: string
}

export interface AmzItems {
  items: AmzItem[]
  countItemsPlus: number
  thisPageNum: number
  maxPageNum: number
}
