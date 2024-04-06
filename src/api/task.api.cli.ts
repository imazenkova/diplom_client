import axios from 'axios'
import { getAxiosSettings, proccessDownload } from "./config.axios";
import { AddTaskRequest, ApiTask, CancelRequest, GetTaskInfoRequest, ITaskInfo, ITaskInfoRes, SaveResultDataRequest, TaskInfoFilteredRequest } from "../shared.lib/api/task.api";

export const TaskApi = {
  addTask: async (obj: AddTaskRequest): Promise<ITaskInfo> => {
    const res = await axios.post(ApiTask.addTask.path, obj, getAxiosSettings())
    return res.data
  },

  getTaskInfo: async (task: GetTaskInfoRequest, proccess?: proccessDownload): Promise<ITaskInfoRes> => {
    const res = await axios.post(ApiTask.getTaskInfo.path, task, {
      ...getAxiosSettings(),
      onDownloadProgress: (p) => proccess ? proccess({ done: p.loaded, all: p.total! }) : null
    })
    return res.data
  },

  getListTaskInfo: async (tasks: TaskInfoFilteredRequest): Promise<ITaskInfo[]> => {
    const res = await axios.post(ApiTask.getListTaskInfo.path, tasks, getAxiosSettings())
    return res.data
  },

  getActiveListTaskInfo: async (): Promise<ITaskInfo[]> => {
    const res = await axios.post(ApiTask.getActiveListTaskInfo.path, {}, getAxiosSettings())
    return res.data
  },

  saveResultData: async (saveResultDataRequest: SaveResultDataRequest, proccess?: proccessDownload): Promise<void> => {
    const res = await axios.post(ApiTask.saveResultData.path, saveResultDataRequest, {
      ...getAxiosSettings(),
      onDownloadProgress: (p) => proccess ? proccess({ done: p.loaded, all: p.total! }) : null
    })
    return res.data
  },

  cancel: async (tasks: CancelRequest): Promise<ITaskInfo> => {
    const res = await axios.post(ApiTask.cancel.path, tasks, getAxiosSettings())
    return res.data
  }
}
