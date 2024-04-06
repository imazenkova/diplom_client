export class FileUtils {
  public static getFileExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf(".") - 2) >>> 0) + 2);
  }
}
