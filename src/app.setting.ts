import package_json from '../../asin-expert-client/package.json'
export type TypeAppMode = 'dev' | 'prod'

const routePathType = {//пути,которые используются дважды
  auth: '/auth',
  templateEdit: '/pricecomparator/template/edit'
}


export class AppSettig {
  static readonly Mode: TypeAppMode = process.env.REACT_APP_MODE as TypeAppMode || 'prod'
  static readonly servUrl: string = process.env.REACT_APP_SERV_URL || 'http://localhost:4000';

  static readonly maxAgeAuth: number = 30 * 24 * 60 * 60 * 1000;
  static readonly routePath = routePathType;
  public static getBaseURL() {
    const urlObj = new URL(document.baseURI);
    return `${urlObj.protocol}//${urlObj.host}`;
  }

  public static getVersion() {
    return package_json.version
  }

  public static getServUrl() {
    if (AppSettig.Mode === 'dev') return ''
    else if (AppSettig.Mode === 'prod') {
      return AppSettig.servUrl === '/' ? AppSettig.getBaseURL() : AppSettig.servUrl
    }
    return AppSettig.servUrl
  }

  public static getApiUrl(pathUrl: string) {
    return AppSettig.getServUrl() + pathUrl
  }

}
