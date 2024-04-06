import { ASINColumns, colNormalize } from "../../../../../components/table/asin-table-columns";
import { ITaskInfoRes } from "../../../../../shared.lib/api/task.api";
import { adate, aimgeHeader } from "./formaters";

export const getImageURLWB = (productId: number, order = 1) => {
  const vol = Math.floor(productId / 100000);
  const part = Math.floor(productId / 1000)
  const random = Date.now();

  const basket = getBasketNumber(productId);
  const basketWithZero = basket < 10 ? `0${basket}` : basket;

  const URL = `https://basket-${basketWithZero}.wb.ru/vol${vol}/part${part}/${productId}/images/c516x688/${order}.jpg?r=${random}`
  return URL
};

const getBasketNumber = (productId: number) => {
  const basket = function (t: number) {
    if (t >= 0 && t <= 143) return 1;
    if (t >= 144 && t <= 287) return 2;
    if (t >= 288 && t <= 431) return 3;
    if (t >= 432 && t <= 719) return 4;
    if (t >= 720 && t <= 1007) return 5;
    if (t >= 1008 && t <= 1061) return 6;
    if (t >= 1062 && t <= 1115) return 7;
    if (t >= 1116 && t <= 1169) return 8;
    if (t >= 1170 && t <= 1313) return 9;
    if (t >= 1314 && t <= 1601) return 10;
    if (t >= 1602 && t <= 1655) return 11;
    if (t >= 1656 && t <= 1919) return 12;
    if (t >= 1920 && t <= 2045) return 13;
    return 14;
  };
  return basket(Math.floor(productId / 1e5));
};

export const existListFromQuerySuplWBColumns = (data?: ITaskInfoRes, excludeTotal = false) => {
  const res: ASINColumns<any> = [
    { title: 'Query', frozen: true, field: 'query', dataType: 'string', width: 250 },
  ]
  if (!excludeTotal) res.push({ title: 'Total', frozen: true, field: 'total', dataType: 'number', width: 60 })
  res.push({ title: 'Count', field: 'count', dataType: 'string', width: 60 })
  res.push({ title: 'Freq', field: 'freq', dataType: 'number', width: 60 })
  res.push({ title: 'Date', field: 'date', dataType: 'date', formatter: adate, formatterParams: { outputFormat: 'date' } },)

  if (!data) return res
  if ((data.type !== 'existListFromQuerySuplWB') && (data.type !== 'posListFromQueryWB'))  return res

  if (data?.resultData?.length === 0) return res

  const firstRow = Array.from(data?.resultData!)[0] as any

  firstRow.pos.forEach((v: any, i: number) => {
    const s: any = {
      title: v.name, field: `${i}`, dataType: 'number', formatter: 'link',
      formatterParams: { url: `https://www.wildberries.ru/catalog/${v.id}/detail.aspx` },
      mutator: (val: any, data: any) => {
        return data.pos[i].val
      }
    }

    if (v.name === `${v.id}`) { //значит добавляем фото в заголовок
      s.titleFormatter = aimgeHeader
      s.titleFormatterParams = { src: getImageURLWB(v.id) }
    }
    res.push(s)
  })


  return colNormalize(res)
}
