
//Все объеденено в один файл специально т.к. при экспорет на клиент работает другой модуль компиляции поэтому не работает правильно import

//-----------------------------------------sorter.types.ts--------------------------------------------------------------------------------

export enum SorterType  {
  ascending = 0,
  descending = 1

}
export interface SorterCol<T> {
  name: keyof T | number;
  sort: SorterType;
}

export type ISorter<T> = SorterCol<T>[];

//-----------------------------------------END filter-types.ts--------------------------------------------------------------------------------

//-----------------------------------------sorter.ts--------------------------------------------------------------------------------
export class Sorter<T = any> {
  private _sorter: ISorter<T>;

  constructor(sorter: ISorter<T>) {
    this._sorter = sorter;
  }

  apply(data: T[]): T[] {
    return data.sort((a, b) => this.compare(a, b));
  }

  private compare(a: any, b: any): number {
    for (let sorter  of this._sorter ) {
      let valueA = a[sorter.name];
      let valueB = b[sorter.name];

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        if (valueA < valueB) return sorter.sort === SorterType.ascending ? -1 : 1;
        if (valueA > valueB) return sorter.sort === SorterType.ascending ? 1 : -1;
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        let comparison = valueA.localeCompare(valueB);
        if (comparison !== 0) return sorter.sort === SorterType.ascending ? comparison : -comparison;
      } else if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        if (!valueA && valueB) return sorter.sort === SorterType.ascending ? -1 : 1;
        if (valueA && !valueB) return sorter.sort === SorterType.ascending ? 1 : -1;
      }
    }
    return 0;
  }
}
//-----------------------------------------END sorter.ts--------------------------------------------------------------------------------
