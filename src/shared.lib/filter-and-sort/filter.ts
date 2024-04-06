//Все объеденено в один файл специально т.к. при экспорет на клиент работает другой модуль компиляции поэтому не работает правильно import

//-----------------------------------------filter.types.ts--------------------------------------------------------------------------------

export enum Logic {
  where = 0,
  and = 1,
  or = 2,
}

export enum Constraints {
  none = 0,
  strIs = 1,
  strIsNot = 2,
  strContains = 3,
  strDoesNotContains = 4,
  strStartWith = 5,
  strEndWith = 6,
  strIsEmpty = 7,
  strIsNotEmpty = 8,

  numEquals = 100,
  numNotEquals = 101,
  numGreaterThan = 102,
  numLessThan = 103,
  numGreaterThanOrEqualTo = 104,
  numLessThanOrEqualTo = 105,
  numIsEven = 106,
  numIsOdd = 107,

  boolIs = 200,
  boolIsNot = 201,
}

export type FilterItemValue = string | number | boolean

export interface FilterItem<T> {
  name: keyof T;
  constraints: Constraints;
  value: FilterItemValue;
}

export interface FilterRow<T> {
  logic: Logic;
  item: FilterItem<T> | FilterGroup<T>;
}

export type FilterGroup<T> = FilterRow<T>[];

export type IFilter<T> = FilterGroup<T>;

//-----------------------------------------END filter-types.ts--------------------------------------------------------------------------------

//-----------------------------------------filter.ts--------------------------------------------------------------------------------
export class Filter<T = any> {
  private _filter: FilterGroup<T>;
  private caseSensitive: boolean;

  constructor(filter: IFilter<T>, caseSensitive = false) {
    this.validateFilterGroupThrow(filter)
    this._filter = filter;
    this.caseSensitive = caseSensitive;
  }

  validateFilterGroupThrow<T>(filterGroup: FilterGroup<T>) {
    for (const filterRow of filterGroup) {
      if (Array.isArray(filterRow.item)) {
        this.validateFilterGroupThrow(filterRow.item)
      } else {
        this.validateFilterItemThrow(filterRow.item)
      }
    }
  }

  validateFilterItemThrow<T>(filterItem: FilterItem<T>) {
    const { constraints, value } = filterItem;

    if (!Constraints[filterItem.constraints]) {
      throw new Error(`Invalid constraint: ${filterItem.constraints} is not a valid member of Constraints enum.`);
    }

    if (constraints >= Constraints.strIs && constraints <= 99) {
      if (typeof value !== 'string') {
        throw new Error('Expected a string value for the given constraint.');
      }
    } else if (constraints >= Constraints.numEquals && constraints <= 199) {
      if (typeof value !== 'number') {
        throw new Error('Expected a number value for the given constraint.');
      }
    } else if (constraints >= Constraints.boolIs && constraints <= 299) {
      if (typeof value !== 'boolean') {
        throw new Error('Expected a boolean value for the given constraint.');
      }
    } else {
      throw new Error('Invalid constraint provided.');
    }
  }



  // не группа ,а одно правило
  static isFilterItem<T>(item: FilterItem<T> | FilterGroup<T>): item is FilterItem<T> {
    return 'value' in item;
  }

  applyFilter(data: T[]): T[] {
    return data.filter(item => this.applyGroup(this._filter, item));
  }

  private checkResults(results: boolean[], filterGroup: FilterGroup<T>): boolean {
    let currentResult = results[0];

    for (let i = 1; i < results.length; i++) {
      const logic = filterGroup[i].logic; // Учитываем логику следующего элемента
      const nextResult = results[i];

      if (logic === Logic.or) {
        currentResult = currentResult || nextResult;
      } else if (logic === Logic.and) {
        currentResult = currentResult && nextResult;
      }
    }

    return currentResult;
  }

  private applyGroup(filterGroup: FilterGroup<T>, item: T): boolean {
    const results: boolean[] = [];

    for (const filterRow of filterGroup) {
      if (Array.isArray(filterRow.item)) {
        results.push(filterRow.logic === Logic.or
          ? filterRow.item.some(innerRow => this.applyRow(innerRow, item))
          : filterRow.item.every(innerRow => this.applyRow(innerRow, item)));
      } else {
        results.push(this.applyItem(filterRow.item, item));
      }
    }

    return this.checkResults(results, filterGroup);
  }

  private applyRow(filterRow: FilterRow<T>, item: T): boolean {
    if (Array.isArray(filterRow.item)) {
      return this.applyGroup(filterRow.item, item);
    } else {
      return this.applyItem(filterRow.item, item);
    }
  }

  private applyItem(filterItem: FilterItem<T>, item: T): boolean {
    const { name, constraints, value } = filterItem;
    if (constraints >= 0 && constraints <= Constraints.strIsNotEmpty)
      return this.applyToStringConstraints(constraints, item[name] as string, value as string)
    else if (constraints >= 100 && constraints <= Constraints.numIsOdd)
      return this.applyToNumberConstraints(constraints, item[name] as number, value as number)
    else if (constraints >= 200 && constraints <= Constraints.boolIsNot)
      return this.applyToBooleanConstraints(constraints, item[name] as boolean, value as boolean);
    else
      throw new Error(`Unsupported constraint: ${constraints}`);
  }

  private applyToStringConstraints(constraints: Constraints, itemValue: string, filterValue: string): boolean {
    if (itemValue === undefined) itemValue = ''
    switch (constraints) {
      case Constraints.strIs:
        if (this.caseSensitive) {
          return itemValue === filterValue;
        } else {
          return itemValue.localeCompare(filterValue, undefined, { sensitivity: 'accent' }) === 0;
        }
      case Constraints.strIsNot:
        if (this.caseSensitive) {
          return itemValue !== filterValue;
        } else {
          return itemValue.localeCompare(filterValue, undefined, { sensitivity: 'accent' }) !== 0;
        }
      case Constraints.strContains:
        return this.caseSensitive ? itemValue.includes(filterValue) : itemValue.toLowerCase().includes(filterValue.toLowerCase());
      case Constraints.strDoesNotContains:
        return this.caseSensitive ? !itemValue.includes(filterValue) : !itemValue.toLowerCase().includes(filterValue.toLowerCase());
      case Constraints.strStartWith:
        return this.caseSensitive ? itemValue.startsWith(filterValue) : itemValue.toLowerCase().startsWith(filterValue.toLowerCase());
      case Constraints.strEndWith:
        return this.caseSensitive ? itemValue.endsWith(filterValue) : itemValue.toLowerCase().endsWith(filterValue.toLowerCase());
      case Constraints.strIsEmpty:
        return !(itemValue);
      case Constraints.strIsNotEmpty:
        return !!(itemValue);
      default:
        throw new Error(`Unsupported constraint for string type: ${constraints}`);
    }
  }

  private applyToNumberConstraints(constraints: Constraints, itemValue: number, filterValue: number): boolean {
    switch (constraints) {
      case Constraints.numEquals:
        return itemValue === filterValue;
      case Constraints.numNotEquals:
        return itemValue !== filterValue;
      case Constraints.numGreaterThan:
        return itemValue > filterValue;
      case Constraints.numLessThan:
        return itemValue < filterValue;
      case Constraints.numGreaterThanOrEqualTo:
        return itemValue >= filterValue;
      case Constraints.numLessThanOrEqualTo:
        return itemValue <= filterValue;
      case Constraints.numIsEven:
        return itemValue % 2 === 0;
      case Constraints.numIsOdd:
        return itemValue % 2 !== 0;
      default:
        throw new Error(`Unsupported constraint for number data type: ${constraints}`);
    }
  }

  private applyToBooleanConstraints(constraints: Constraints, itemValue: boolean, filterValue: boolean): boolean {
    switch (constraints) {
      case Constraints.boolIs:
        return itemValue === filterValue;
      case Constraints.boolIsNot:
        return itemValue !== filterValue;
      default:
        throw new Error(`Unsupported constraint for boolean data type: ${constraints}`);
    }
  }
}

//-----------------------------------------END filter.ts--------------------------------------------------------------------------------

//-----------------------------------------filter-builder.ts--------------------------------------------------------------------------------

type ConstraintsKeys = keyof typeof Constraints;
const constraintsMap: Record<ConstraintsKeys, Constraints> = {
  none: Constraints.none,
  strIs: Constraints.strIs,
  strIsNot: Constraints.strIsNot,
  strContains: Constraints.strContains,
  strDoesNotContains: Constraints.strDoesNotContains,
  strStartWith: Constraints.strStartWith,
  strEndWith: Constraints.strEndWith,
  strIsEmpty: Constraints.strIsEmpty,
  strIsNotEmpty: Constraints.strIsNotEmpty,
  numEquals: Constraints.numEquals,
  numNotEquals: Constraints.numNotEquals,
  numGreaterThan: Constraints.numGreaterThan,
  numLessThan: Constraints.numLessThan,
  numGreaterThanOrEqualTo: Constraints.numGreaterThanOrEqualTo,
  numLessThanOrEqualTo: Constraints.numLessThanOrEqualTo,
  numIsEven: Constraints.numIsEven,
  numIsOdd: Constraints.numIsOdd,
  boolIs: Constraints.boolIs,
  boolIsNot: Constraints.boolIsNot
};


function check(constraints: ConstraintsKeys, value: string | number | boolean) {
  if (
    (typeof value === 'string' && !constraints.startsWith('str')) ||
    (typeof value === 'number' && !constraints.startsWith('num')) ||
    (typeof value === 'boolean' && !constraints.startsWith('bool'))
  ) {
    throw new Error(`Invalid constraints ${constraints} for value type ${typeof value}`);
  }

}

export class FilterBuilder<T = any> {
  private _filterGroup: FilterGroup<T> = [];

  where(name: keyof T, constraints: ConstraintsKeys, value: string | number | boolean): BodyFilterBuilder<T> {
    check(constraints, value)
    this._filterGroup.push({
      logic: Logic.where,
      item: {
        name,
        constraints: constraintsMap[constraints],
        value,
      },
    });
    return new BodyFilterBuilder<T>(this._filterGroup);
  }
}

export class BodyFilterBuilder<T = any> {
  protected _filterGroup: FilterGroup<T>;

  constructor(filterGroup: FilterGroup<T>) {
    this._filterGroup = filterGroup;
  }

  and(name: keyof T, constraints: ConstraintsKeys, value: string | number | boolean): this {
    check(constraints, value)
    this._filterGroup.push({
      logic: Logic.and,
      item: {
        name,
        constraints: constraintsMap[constraints],
        value,
      },
    });
    return this;
  }

  or(name: keyof T, constraints: ConstraintsKeys, value: string | number | boolean): this {
    check(constraints, value)
    this._filterGroup.push({
      logic: Logic.or,
      item: {
        name,
        constraints: constraintsMap[constraints],
        value,
      },
    });
    return this;
  }

  andGroup(callback: (builder: FilterBuilder<T>) => BodyFilterBuilder<T>): this {
    const group = callback(new FilterBuilder<T>()).build();
    this._filterGroup.push({
      logic: Logic.and,
      item: group,
    });
    return this;
  }

  orGroup(callback: (builder: FilterBuilder<T>) => BodyFilterBuilder<T>): this {
    const group = callback(new FilterBuilder<T>()).build();
    this._filterGroup.push({
      logic: Logic.or,
      item: group,
    });
    return this;
  }

  build(): IFilter<T> {
    return this._filterGroup;
  }
}

//-----------------------------------------END filter-builder.ts--------------------------------------------------------------------------------
