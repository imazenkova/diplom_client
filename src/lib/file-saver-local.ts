import { saveAs } from 'file-saver';

export class FileSaverLocal {

  static saveJSON(obj: any, fileName: string) {
    const jsonString = JSON.stringify(obj);

    saveAs(new Blob([jsonString], { type: "application/json" }), fileName);
  }

  static saveText(obj: string, fileName: string) {
    saveAs(new Blob([obj], { type: "text/plain" }), fileName);
  }
}
