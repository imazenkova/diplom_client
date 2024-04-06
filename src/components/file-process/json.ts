import { RcFile } from 'antd/es/upload/interface';
import { ApiError } from '../../shared.lib/api/errors';

export class JSONReader {
  static readJSON = async (file: RcFile): Promise<any[]> => {
    return new Promise<any[]>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const jsonData = JSON.parse(reader.result as string);
          resolve(jsonData);
        } catch (error) {
          reject(`Failed to parse JSON: ${ApiError.From(error).getFullMessage('; ')}`);
        }
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsText(file);
    });
  };
}
