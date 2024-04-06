import { IComparePricesColumns, getValuesFormula, isRowFormula } from "../../shared.lib/api/task.data";
import { defComparePricesConfig } from "./def-compare-prices-config";

export const findComparePricesConfig = (columns: string[], userConfig?: IComparePricesColumns[]): IComparePricesColumns[] => {
  const allConfigurations = [...defComparePricesConfig, ...(userConfig || [])];
  return allConfigurations.filter(config => {
    const configValues = Object.entries(config)
      .filter(([key, value]) => {
        if (!value) return false
        return !key.startsWith('$')
      })
      .map(([_, value]) => {
        if (isRowFormula(value)) return getValuesFormula(value)
        else return Array.isArray(value) ? value : [value]
      })
      .flat();

    // проверяем, что каждая колонка из списка присутствует в конфигурации
    return configValues.every(column => columns.includes(column));
  });
}




