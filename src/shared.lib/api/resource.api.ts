export const TypeResourceValues = [
  "AmzTable/Sellers",
  "AmzTable/Pages",
  "AmzTable/List",
  "EbayTable/List",
  "EbayTable/Pages",
  "KeepaComparePrices",
  "Test/Pages",
  "PricesTemplate",
  "WB/ExistListFromQuery",
  "WB/PosListFromQuery",
  "WB/ReadListFromQuery"
] as const;

export type TypeResource = typeof TypeResourceValues[number];

export interface IResource {
  //Имя которе будет показываться пользователе те ЧП. Имя уникально в пределах одного типа
  name: string,
  //Тип ресурса это группа записей в который имена уникальны. Типы могут быть любые
  //и ресурсы могут сохранятся для любых нужд. Тип можно представить как папку в которой
  //будут хранится файлы с имененм name
  type: TypeResource,
  //Сам ресурс
  value: any,
  //Необзяательные ресурсы
  value2?: any
  value3?: any
  value4?: any
  value5?: any
}

export interface IItemResource extends Pick<IResource, 'name' | 'type'> { }
export interface IItemTypeResource extends Pick<IResource, 'type'> {
  // будем ли возвращать при запросе value
  respValue: boolean
  respValue2?: boolean
  respValue3?: boolean
  respValue4?: boolean
  respValue5?: boolean
}

export interface IResultResource {
  isError: boolean,
  errMsg?: string
}

export interface ILoadResource {
  resource?: IResource[],
  error: IResultResource,
}

export const ApiResource = {
  /** {@link IResource} => {@link IResultResource}*/
  save: { method: 'post' as const, path: '/api/resource/save' },
  /** {@link IResource}[] => {@link IResultResource}[]*/
  saveMany: { method: 'post' as const, path: '/api/resource/saveMany' },
  /** {@link IItemResource} => {@link ILoadResource}*/
  load: { method: 'post' as const, path: '/api/resource/load' },
  /** {@link IItemResource}[] => {@link ILoadResource}[]*/
  loadMany: { method: 'post' as const, path: '/api/resource/loadMany' },
  /** {@link IItemResource}[] => {@link void}*/
  delete: { method: 'post' as const, path: '/api/resource/delRes' },
  /** {@link IItemTypeResource} => {@link IResource}[]*/
  loadList: { method: 'post' as const, path: '/api/resource/loadList' },
}
