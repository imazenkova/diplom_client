//Поля кипы
export const keepaCol = {
  UPC: "Product Codes: UPC",
  EAN: "Product Codes: EAN",
  asin: "ASIN",
  image: "Image",
  title: "Title",
  brand: "Brand",
  bsr: "Sales Rank: Current",
  bsr_drop30: "Sales Rank: Drops last 30 days",
  bsr_drop90: "Sales Rank: Drops last 90 days",
  rating: "Reviews: Rating",
  review: "Reviews: Review Count",
  review30: "Reviews: Review Count - 30 days avg.",

  buybox_price: "Buy Box: 30 days avg.",
  part_number: "Product Codes: PartNumber",
  model: "Model",
  manufacturer: "Manufacturer",


  offer_count: "New Offer Count: 30 days avg.",
  offer_count_FBA: "Count of retrieved live offers: New, FBA",
  offer_count_FBM: "Count of retrieved live offers: New, FBM",
  categories: "Categories: Root",
  listed_since: "Listed since",

  numof_item: "Number of Items",
  pack_qual: "Package: Quantity",
  weight: "Item: Weight (g)"
}


export function getMismatchedValues(values: string[]): string[] {
  const keepaValuesSet = new Set(values);
  const mismatched = [];

  for (const value of Object.values(keepaCol)) {
    if (!keepaValuesSet.has(value)) {
      mismatched.push(value);
    }
  }

  return mismatched;
}


export interface KeepaComparePrices {
  //Имя темлэйта
  tName: string,
  spl_title: string,
  spl_price: number,
  spl_url: string,
  spl_img: string,
  spl_brand: string,
  upc: string,
  ean: string,
  spl_attr: string,

  asin: string,
  amz_img: string,
  amz_categories: string,
  amz_topbsr: number,
  amz_bsr_d30: number,
  amz_bsr_d90: number,
  amz_price: number,
  amz_offer_c30: number,
  amz_offer_cFBA: number,
  amz_offer_cFBM: number,
  amz_since: Date,
  amz_brand: string,
  amz_model: string,
  amz_rating: number,
  amz_review30: number,
  amz_title: string,
  amz_manuf: string,
  amz_set: string,
  amz_pack_qual: number,
  amz_weight: number,
}
