export const zicodeKeys = [
  "none",
  //Емэйл  уже существует
  "auth.emailExist",
  //Емэйл не подтвержден
  "auth.emailNotVerified",
  //Код подтверждения не совподает
  "auth.codeNotEq",
  //Пользователь не найден
  "auth.UserNotExist",
  //Не верный пароль
  "auth.ErrPassword",
  //Отсутствует соединение
  "net.NotNetwork",
] as const
export type TypeZICode = typeof zicodeKeys[number];


export interface IApiError {
  aexCode: TypeZICode
  aexMessage: string
  aexStack: string
}


export class ApiError extends Error implements IApiError {
  public aexMessage: string = ''
  public aexCode: TypeZICode = 'none'
  public aexStack: string = ''

  public getFullMessage(delimeter: string = '\n') {
    return this.getMessages().join(delimeter)
  }

  public getMessages() {
    if (this.message === this.aexMessage) return [this.message]
    return [this.message, this.aexMessage]
  }

  public override toString() {
    return `aexCode: ${this.aexCode}\naexMessage: ${this.aexMessage}\n`
  }

  constructor(aexCode: TypeZICode, message?: string, stack?: string) {
    super(message);
    if (stack) {
      this.aexStack = stack
      this.stack = stack
    }
    else {
      this.aexStack = this.stack || ''
    }
    this.aexCode = aexCode
    this.aexMessage = message || ''
  }

  static to(error: any) {
    let aexCode: TypeZICode = 'none'
    if (error.aexCode) aexCode = error.aexCode

    if (error instanceof Error) {
      return new ApiError(aexCode, error.message)
    } else return new ApiError(aexCode)
  }

  static From(error: any): ApiError {
    return ApiError.FromAxios(error)
  }

  static FromAxios(error: any): ApiError {
    //Значит ApiError
    if (error.aexCode) return new ApiError(error.aexCode, error.aexMessage, error.aexStack)

    if (error instanceof Error) {
      if (error instanceof ApiError) return error
      //Запакован в объекте axios
      if ((error as any).response && (error as any).response.data) {
        const apierr = (error as any).response.data as IApiError
        if (!apierr.aexCode) return new ApiError('none', error.message, error.stack)
        else return new ApiError(apierr.aexCode, apierr.aexMessage, apierr.aexStack)
      }
      if ((error as any).code === 'ERR_NETWORK') {
        return new ApiError('net.NotNetwork', error.message, error.stack)
      }
      return new ApiError('none', error.message, error.stack)
    }
    else if (typeof error === "string") {
      return new ApiError('none', error)
    }

    return new ApiError('none')
  }
}
