import { FilterType } from "../shared.lib.types";

export const TypeTaskValues = [
  "none",
  //Test tasks
  "readTestTask", "readTestUnits",
  //Amazon tasks
  "readAsinsAMZ", "readUrlsAMZ", "readListFromUrlAMZ",
  //eBay tasks
  "readUrlsEbay", "readListFromUrlEbay", "readPagesFromSellerEbay",
  //price-comparator
  "comparePricesWithKeepa",
  //WB tasks
  "readListFromQueryWB",
  //Поиск нужных листингов по селлеру
  "existListFromQuerySuplWB",
  //Отслеживание текущих позиций по поставщику или списку skuwb
  "posListFromQueryWB"
] as const;

export type TypeTask = typeof TypeTaskValues[number];

export function toTypeTask(value: string | null): TypeTask {
  if (value === null) return 'none'
  const lowerCaseValue = value.toLowerCase();
  const matchingType = TypeTaskValues.find((type) => type.toLowerCase() === lowerCaseValue);
  return matchingType || "none";
}

export enum StateTask {
  //Последовательность и цифры не меняем т.к. уже в базе
  wait = 0,
  proccess = 1,
  cancel_request = 2,
  complite = 7,
  cancel = 8,
  complite_err = 9,
}

export class StateTaskUls {
  public static lessIsNotComplite(): number {
    return StateTask.complite as number
  }

  public static isNotComplite(stateTask: StateTask) {
    return (stateTask < StateTask.complite)
  }
  public static isComplite(stateTask: StateTask) {
    return (stateTask >= StateTask.complite)
  }
}

export interface IProccessInfo {
  all: number,
  done: number
}

export interface ITaskInfo {
  id: number,
  name: string,
  desc: string,
  type: TypeTask,
  state: StateTask
  proccess: IProccessInfo,
  timeCreate: number,
  timeStart: number,
  timeEnd: number,
  resultErrors?:  IUnitOutcomeUid[],
}

export interface IResultDataInfo {
  //Количество строк
  rowsCount: number,
  lastChange: Date
}

//Информация о
export interface IUnitOutcome {
  warns?: string[]
  errs?: string[]
}

export class Outcome {
  static hasUnitOutcome(unitOutcome?: IUnitOutcome | null): boolean {
    if (!unitOutcome) return false
    return Outcome.isErrs(unitOutcome) || Outcome.isWarns(unitOutcome);
  }

  static isErrs(unitOutcome?: IUnitOutcome | null): boolean {
    if (!unitOutcome) return false
    return Boolean(unitOutcome.errs && unitOutcome.errs.length);
  }
  static isWarns(unitOutcome?: IUnitOutcome | null): boolean {
    if (!unitOutcome) return false
    return Boolean(unitOutcome.warns && unitOutcome.warns.length);
  }

  static append(to: IUnitOutcome, from: IUnitOutcome) {
    if (Outcome.isErrs(from)) {
      if (Outcome.isErrs(to)) to.errs?.push(...from.errs!)
      else to.errs = from.errs
    }
    if (Outcome.isWarns(from)) {
      if (Outcome.isWarns(to)) to.warns?.push(...from.warns!)
      else to.warns = from.warns
    }
  }
}

export interface IUnitOutcomeUid extends IUnitOutcome {
  //Это номер юнита те одного считывания с устройства. Например когда мы считываем за однин запрос 1000 записей
  //для того чтобы не повторять и не забивать траф используются uid который есть в каждой записи resultData
  uid: number
}

/**
 * Полные данные по заданию включая результат работы и ошибки
 */
export interface ITaskInfoRes extends ITaskInfo {
  inputData?: any
  //Инофрмация по заданию
  taskResult?: { compite: 'success' | 'error', error: string }
  resultData?: any[]
  resultDataInfo?: IResultDataInfo
  //Выводятся только юниты где есть ошибка или предупреждения
  resultErrors?: IUnitOutcomeUid[]
}

export const optionalTaskInfoResKeys = ["inputData", 'resultData', 'resultDataInfo', 'resultErrors', 'taskResult'] as const
export type optionalTaskInfoResKeysType = typeof optionalTaskInfoResKeys[number];

export interface AddTaskRequest extends Pick<ITaskInfoRes, 'name' | 'desc' | 'type' | 'inputData'> { }

export type GetTaskInfo = Pick<ITaskInfo, 'id'>;

export type TaskInfoFilteredRequest = FilterType<Pick<ITaskInfo, 'type' | 'state' | 'timeStart' | 'timeEnd' | 'timeCreate' | 'name'>>;

export interface GetTaskInfoRequest extends Pick<ITaskInfo, 'id'> {
  fieldsAnswer: optionalTaskInfoResKeysType[]
}

export interface CancelRequest extends Pick<ITaskInfo, 'id'> { }

export interface SaveResultDataRequest extends Pick<ITaskInfoRes, 'id' | 'resultData'> { }

// Используя Partial мы делаем поля 'type' и 'state' необязательными.
// Используя Pick мы выбираем только поля 'type' и 'state' из интерфейса ITaskInfo.
// И мы переопределяем поле 'timeCreate' нашим новым типом TimeRange.


export const ApiTask = {
  /** {@link AddTaskRequest} => {@link ITaskInfo}*/
  addTask: { method: 'post' as const, path: '/api/task/addTask' },
  /** {@link GetTaskInfoRequest} => {@link ITaskInfoRes}*/
  getTaskInfo: { method: 'post' as const, path: '/api/task/getTaskInfo' },
  /**
   * Данные считываются с DB
   * {@link TaskInfoFilteredRequest} => {@link ITaskInfo[]}*/
  getListTaskInfo: { method: 'post' as const, path: '/api/task/getListTaskInfo' },
  /**
   * Данные считываются только  с памяти без фильтрации
   * {@link void} => {@link ITaskInfo[]}
   * */
  getActiveListTaskInfo: { method: 'post' as const, path: '/api/task/getActiveListTaskInfo' },

  /** {@link CancelRequest} => {@link ITaskInfoRes}*/
  cancel: { method: 'post' as const, path: '/api/task/cancel' },

  /** {@link SaveResultDataRequest} => {@link void}*/
  saveResultData: { method: 'post' as const, path: '/api/task/save/resultdata' },
}
