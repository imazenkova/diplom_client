import { ITaskInfo } from "./task.api"

export const TypeNotificationValues = [
  "taskFinish",
  "taskStart",
] as const

export type TypeNotification = typeof TypeNotificationValues[number]

//Типы кототрые в зависимости от тип находятся в переменной data
export interface TaskNotification {
  taskInfo: ITaskInfo,
}

export interface INotification {
  id: number
  type: TypeNotification
  message: string
  data: TaskNotification
  confirmed: boolean
  created_at: Date
  confirmed_at: Date
}

export interface INotificationReq extends Pick<INotification, 'type' | 'message' | 'data'> {
  confirmed?: boolean;
}
export interface INotificationResp extends Pick<INotification, 'id'> { }

export interface IConfirmNotification {
  id: number
}

export interface IUnconfirmNotificationCount {
  count: number
}

export interface IConfirmManyNotifications {
  ids: number[]
}

export interface IGetNotificationReq {
  limit: number
  offset: number
  dateFrom: Date
}

export interface IConfirmNotificationsBeforeDate {
  dateBefore: Date
}

export interface IGetNotificationResp {
  notifications: INotification[];
  total: number;
}

export const ApiNotification = {
  /** {@link INotificationReq}[] => {@link INotificationResp}[] */
  addNotifications: { method: 'post' as const, path: '/api/notification/add' },

  /** {@link IGetNotificationReq} => {@link IGetNotificationResp} */
  getNotifications: { method: 'post' as const, path: '/api/notification/get' },

  /** {@link void} => {@link IUnconfirmNotificationCount} */
  getUnconfirmedNotificationCount: { method: 'post' as const, path: '/api/notification/unconfirmed/getCount' },

  /** {@link IConfirmManyNotifications} => {@link IUnconfirmNotificationCount} */
  confirmManyNotifications: { method: 'post' as const, path: '/api/notification/confirmMany' },

  /** {@link IConfirmNotificationsBeforeDate} => {@link IUnconfirmNotificationCount} */
  confirmNotificationsBeforeDate: { method: 'post' as const, path: '/api/notification/confirmBeforeDate' },
}
