import { Cookies } from 'react-cookie';
import { Translation, lang } from "./locales/lang";
import { LoginResponse } from "./shared.lib/api/auth.api";
import { Locale } from "./shared.lib/locale.lang";
import { CookiesKeys } from "./types/cookies-keys";
import { eqObj } from './hooks/eq-obj';

const cookies = new Cookies()

export type GlobalDispatch = (action: ActionState) => void;

export interface ContextType {
  state?: GlobalState;
  dispatch?: GlobalDispatch;
}

export enum State {
  DEFAULT, //Для инициализации
  BEARER_TOKEN,
  PROFILE,
  RELOAD,
  LOGOUT,
  REDIRECT_URL,
}

export type ActionState =
  | { type: State.BEARER_TOKEN; payload: string; maxAge: number }
  | { type: State.PROFILE; payload: LoginResponse | null }
  | { type: State.RELOAD; payload: boolean }
  | { type: State.LOGOUT }
  | { type: State.REDIRECT_URL; payload: string };

export interface LocState {
  l: Translation
  local: Intl.LocalesArgument
}

//Глобальный объект состояния
export class GlobalState implements LocState {
  //Считать bearerToken из кука
  public bearerToken: string | null = cookies.get('access')
  public profile: LoginResponse | null = null
  public reload: boolean = false
  public l: Translation = lang.en
  //Теущая локаль для перевода в строки чисел, времен и т.д.
  public local: Intl.LocalesArgument = 'en-US'
  public redirectUrl: string = '/'
  public isAuth: boolean = false

  //Обязательно используем статические методы т.к. мы копируем контексти и this не работает
  public static isAuth(state: GlobalState) {
    return state.profile != null
  }
}

export const appReducer = (state: GlobalState, action: ActionState) => {
  switch (action.type) {
    case State.BEARER_TOKEN:
      cookies.set(CookiesKeys.access, action.payload, {
        maxAge: action.maxAge,
        path: '/'
      })
      return { ...state, bearerToken: action.payload }
    case State.PROFILE:
      state.l = lang[action.payload?.user.lang!] as Translation
      state.local = Locale[action.payload?.user.lang!]
      const newState = { ...state, profile: action.payload }
      //Для того чтобы не было лишней перерисовки
      if (eqObj(state, newState)) return state
      else return newState
    case State.RELOAD:
      return { ...state, reload: action.payload }
    case State.LOGOUT:
      cookies.remove(CookiesKeys.access, { path: '/' })
      return { ...state, bearerToken: null, profile: null }
    case State.REDIRECT_URL:
      return { ...state, redirectUrl: action.payload }
  }
}
