import axios from 'axios';
import {
  ApiNotification,
  IConfirmManyNotifications,
  IConfirmNotificationsBeforeDate,
  IGetNotificationReq,
  IGetNotificationResp,
  INotificationReq,
  INotificationResp,
  IUnconfirmNotificationCount
} from '../shared.lib/api/notification.api';
import { getAxiosSettings } from "./config.axios";

export const NotificationApi = {
  addNotifications: async (notificationPayload: INotificationReq[]): Promise<INotificationResp[]> => {
    const res = await axios[ApiNotification.addNotifications.method](ApiNotification.addNotifications.path, notificationPayload, getAxiosSettings())
    return res.data
  },

  getNotifications: async (req: IGetNotificationReq): Promise<IGetNotificationResp> => {
    const res = await axios[ApiNotification.getNotifications.method](ApiNotification.getNotifications.path, req, getAxiosSettings())
    return res.data
  },

  getUnconfirmedNotificationCount: async (): Promise<IUnconfirmNotificationCount> => {
    const res = await axios[ApiNotification.getUnconfirmedNotificationCount.method](ApiNotification.getUnconfirmedNotificationCount.path, {}, getAxiosSettings())
    return res.data
  },

  confirmManyNotifications: async (req: IConfirmManyNotifications): Promise<IUnconfirmNotificationCount> => {
    const res = await axios[ApiNotification.confirmManyNotifications.method](ApiNotification.confirmManyNotifications.path, req, getAxiosSettings())
    return res.data
  },

  confirmNotificationsBeforeDate: async (req: IConfirmNotificationsBeforeDate): Promise<IUnconfirmNotificationCount> => {
    const res = await axios[ApiNotification.confirmNotificationsBeforeDate.method](ApiNotification.confirmNotificationsBeforeDate.path, req, getAxiosSettings())
    return res.data
  },
};
