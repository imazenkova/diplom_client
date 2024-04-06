import { AxiosRequestConfig } from "axios";
import { Cookies } from 'react-cookie'
import { AppSettig } from "../app.setting";
import { IProccessInfo } from "../shared.lib/api/task.api";
import { CookiesKeys } from "../types/cookies-keys";

const cookies = new Cookies()

export type proccessDownload = (proccess: IProccessInfo) => void

export const getAuthHeader = () => {
  return { 'Authorization': `Bearer ${cookies.get(CookiesKeys.access) || ''}` }
}

export const getAxiosSettings = <T>(): AxiosRequestConfig<T> => {
  const cxt = {
    baseURL: AppSettig.getServUrl(),
    headers: {...getAuthHeader()}
  }

  return cxt
}
