import { NavigateFunction } from 'react-router-dom';
import { GlobalState } from '../../Reduser';
import { INotification, TaskNotification } from '../../shared.lib/api/notification.api';

const link = (to: string, text: string, nav: NavigateFunction) => {
  return <><a onClick={() => nav(to)}>{text}</a></>
}

const parse = (notif: INotification, state: GlobalState, nav: NavigateFunction) => {
  if ((notif.type === 'taskFinish') || (notif.type === 'taskStart')) {
    const tnotif = notif.data as TaskNotification
    let add = <>{notif.type === 'taskFinish' && link(`tasks/report?id=${tnotif.taskInfo.id}`, `${state!.l.notif.report}`, nav)}</>
    let msg = <>{state.l.notif.typeNotification[notif.type]}, id:{tnotif.taskInfo.id}, {state.l.asinTable.name}{link(`/tasks?id=${tnotif.taskInfo.id}`, tnotif.taskInfo.name, nav)}. {add}</>
    return msg
  }
}

export const toNotificationMessage = (notif: INotification, state: GlobalState, nav: NavigateFunction) => {
  return parse(notif, state, nav)
}
