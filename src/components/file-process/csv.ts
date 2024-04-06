import Papa from 'papaparse';
import { RcFile } from 'antd/es/upload/interface';

//Только приходят колонки которые мы указали в соответствии с последовательностию индексов 0,1
export type FilterRowType = (columnsData: string[]) => boolean;

export class CSVReader {
  static readHeaderFromFile = async (file: RcFile, delimeter: string = ','): Promise<string[]> => {
    return new Promise<string[]>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const fileContent = reader.result as string;

        Papa.parse(fileContent, {
          delimiter: delimeter!,
          preview: 1, // Ограничим парсинг только первой строкой
          complete: (result) => {
            resolve(result.data[0] as string[]);
          },
          error: (error: any) => {
            reject(error.message);
          }
        });
      };

      reader.onerror = () => {
        reject(reader.error?.message);
      };

      reader.readAsText(file);
    });
  };

  static readColumnFromFile = async (file: RcFile, columnsName: string[], filterRow: FilterRowType, delimeter: string = ','): Promise<string[][]> => {
    return new Promise<string[][]>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const fileContent = reader.result as string;

        const headerIndxs: number[] = [];
        const filteredData: string[][] = [];

        Papa.parse(fileContent, {
          delimiter: delimeter!,
          step: (results) => {
            const currentRow = results.data as string[];

            if (!headerIndxs.length) { // Первая строка - заголовок
              for (let name of columnsName) {
                const index = currentRow.indexOf(name);
                if (index === -1) {
                  reject(`${name} column not found`);
                  return;
                }
                headerIndxs.push(index);
              }
            } else {
              const columnData = headerIndxs.map(idx => currentRow[idx]);
              if (filterRow(columnData)) {
                filteredData.push(columnData);
              }
            }
          },
          complete: () => {
            resolve(filteredData);
          },
          error: (error: any) => {
            reject(error.message);
          }
        });
      };

      reader.onerror = () => {
        reject(reader.error?.message);
      };

      reader.readAsText(file);
    });
  };

  static convertToJSON = (file: RcFile, delimiter?: string): Promise<any[]> => {
    return new Promise<any[]>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const csvData = reader.result as string;

        Papa.parse(csvData, {
          header: true,
          delimiter: delimiter, // Если delimiter не предоставлен, PapaParse попытается автоматически определить его
          dynamicTyping: true, // Опционально: автоматически преобразует строки в числа, даты и т.д., если это возможно
          complete: (result) => {
            resolve(result.data);
          },
          error: (error: any) => {
            reject(error.message);
          }
        });
      };

      reader.onerror = () => {
        reject(reader.error?.message);
      };

      reader.readAsText(file);
    });
  };


}

