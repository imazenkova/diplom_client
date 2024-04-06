export type EbayPageStatus = 'Ok' | 'ErrVar' | 'OkV' | 'OTHER' | 'OFS' | 'Del' | 'Voc' | 'Err'

export interface EbayPageSeller {
  selUrl: string,
  selId: string,
  selName: string,
  selFeedbackCount: number,
  selSold: number,
  selFeedback: number
}


export interface EbayPage extends EbayPageSeller {
  //Анало asin
  ein: string
  name: string
  url: string
  urlScan: string
  price: number
  shipPrice: number
  location: string
  isVar: boolean
  condition: string
  loImgs: string[]

  brand: string
  status: EbayPageStatus
  upc: string
  ean: string,
  mpn: string
  numberOfPieces: number
  sold: number
  count: number
  deliveryFrom: number
  deliveryTo: number
  hiImgs: string[]
}

export interface EbayItem extends Pick<EbayPage, 'ein' | 'urlScan' | 'name' | 'url' | 'price' | 'shipPrice' | 'isVar' | 'condition' | 'loImgs'> {
  priceTo: number
  sellerInfo: string
}

export interface EbayItems {
  items: EbayItem[]
  countItemsPlus: number
  thisPageNum: number
}

