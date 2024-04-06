//Все общие типы для приложения

//Типы для сообщений push
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type NotificationApp = (type: NotificationType, message: string, description: string)  => void
