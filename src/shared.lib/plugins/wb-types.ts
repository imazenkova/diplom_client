
export interface WBApiSeller {
  supplierId: number
  supplier: string
  supplierRating: number
}

//https://ru.stackoverflow.com/questions/1512200/%D0%9A%D0%B0%D0%BA-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D1%8C%D0%BD%D0%BE-%D0%B2%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D1%82%D1%8C-%D0%B7%D0%BD%D0%B0%D1%87%D0%B5%D0%BD%D0%B8%D1%8F-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%B0%D1%80%D1%81%D0%B8%D0%BD%D0%B3%D0%B0-%D0%BD%D0%B0-wildberries
export interface WBApiItem extends WBApiSeller {
  //Картинка главного рисунка в маленьком формате Small
  //imgMainS: string
  skuWB: number //артикул
  name: string
  feedbacks: number
  root: number
  //Цена за которую продает
  priceSale: number,
  //Полный прайс
  priceFull: number,
  //Скидка в процентах
  discount: number,
  //Количество фоток
  pics: number,
  //Время доставки в часах
  delivTime: number,
  rating: number
  reviewRating: number
  adFrom: number
  adTo: number
  brand: string
  adCpm: number
}

export interface WBApiItems {
  items: WBApiItem[]
  thisPageNum: number
}

