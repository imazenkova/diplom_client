import { RcFile } from 'antd/es/upload/interface';
import { FilterRowType } from './csv';
//import * as XLSX from 'xlsx';
declare var XLSX: any;

export class XLSXReader {
  static readHeaderFromFile = async (file: RcFile): Promise<string[]> => {
    return new Promise<string[]>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target?.result;
        if (!data) {
          reject("Failed to read file data");
          return;
        }

        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const header: string[] = [];
        let emptyCellsInARow = 0;
        const maxEmptyCellsInARow = 3;  // остановитесь после 2 пустых ячеек подряд

        for (let column = 0; emptyCellsInARow < maxEmptyCellsInARow; column++) {
          const cellAddress = XLSX.utils.encode_col(column) + "1";
          const cellValue = worksheet[cellAddress]?.v;


          if (cellValue) {
            header.push(cellValue);
            emptyCellsInARow = 0;  // сбросить счетчик пустых ячеек
          } else {
            emptyCellsInARow++;
          }
        }

        resolve(header);
      };

      reader.onerror = () => {
        reject(reader.error?.message);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  static readColumnFromFile = async (file: RcFile, columnsName: string[], filterRow: FilterRowType): Promise<string[][]> => {
    return new Promise<string[][]>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target?.result;
        if (!data) {
          reject("Failed to read file data");
          return;
        }

        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const header = jsonData[0] as string[];

        const headerIndxs: number[] = [];

        columnsName.forEach(name => {
          const index = header.indexOf(name);
          if (index === -1) {
            reject(`${name} column not found`);
            return;
          }
          headerIndxs.push(index);
        });

        const filteredData: string[][] = [];

        for (let i = 1; i < jsonData.length; i++) {  // Starting from 1 to skip the header row
          const currentRow = jsonData[i] as string[];
          let columnData = headerIndxs.map(idx => currentRow[idx]);
          columnData = columnData.map(v => v === 'null' ? '' : v)
          if (filterRow(columnData)) {
            filteredData.push(columnData);
          }
        }

        resolve(filteredData);
      };

      reader.onerror = () => {
        reject(reader.error?.message);
      };

      reader.readAsArrayBuffer(file);
    });
  };


  static convertToJSON = (file: RcFile): Promise<any[]> => {
    return new Promise<string[][]>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target?.result;
        if (!data) {
          reject("Failed to read file data");
          return;
        }

        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        resolve(jsonData);
      };

      reader.onerror = () => {
        reject(reader.error?.message);
      };

      reader.readAsArrayBuffer(file);
    });
  };


}
