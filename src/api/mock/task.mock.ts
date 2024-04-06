import MockAdapter from "axios-mock-adapter";
import { ApiTask, ITaskInfo, StateTask, AddTaskRequest, GetTaskInfo } from "../../shared.lib/api/task.api";

export const startServMockTask = (mock: MockAdapter) => {

  mock.onPost(ApiTask.addTask.path).reply((config) => {
    const data = JSON.parse(config.data || '') as AddTaskRequest

    const alltasks = JSON.parse(localStorage.getItem('__tasks') || '[]')as ITaskInfo[]


    alltasks.push({
      id: alltasks.length,
      name: 'test',
      desc: '',
      proccess: {
        all: 15,
        done: 0
      },
      timeStart: Date.now(),
      timeEnd: 0,
      timeCreate: Date.now(),
      state: StateTask.wait,
      type: data.type
    })


    localStorage.setItem('__tasks', JSON.stringify(alltasks))
    addCountCurrentTask()


    return [200, alltasks[alltasks.length - 1]]
  })

  function addCountCurrentTask() {
    const alltasks = JSON.parse(localStorage.getItem('__tasks') || '[]') as ITaskInfo[]
    if (alltasks.length === 0) return

    let task: ITaskInfo | null = null
    const procTask = alltasks.filter(v => v.state === StateTask.proccess)
    if (!procTask.length) {
      const procTask1 = alltasks.filter(v => v.state === StateTask.wait)
      if (procTask1.length === 0) return
      task = procTask1[0]
    } else {
      task = procTask[0]
    }

    task.proccess.done++
    if (task.proccess.done >= task.proccess.all) {
      task.timeEnd = Date.now()
      task.state = StateTask.complite
      localStorage.setItem('__tasks', JSON.stringify(alltasks))
      addCountCurrentTask()
    } else {
      localStorage.setItem('__tasks', JSON.stringify(alltasks))
    }
  }

  mock.onGet(ApiTask.getTaskInfo.path).reply((config) => {
    const data = JSON.parse(config.data || '') as GetTaskInfo

    const alltasks = JSON.parse(localStorage.getItem('__tasks') || '[]') as ITaskInfo[]

    alltasks.filter(v => v.id === data.id)

    addCountCurrentTask()

    return [200, alltasks[alltasks.length - 1]]
  })


  mock.onGet(ApiTask.getListTaskInfo.path).reply((config) => {
    addCountCurrentTask()
    let alltasks = JSON.parse(localStorage.getItem('__tasks') || '[]') as ITaskInfo[]
    alltasks = alltasks.sort((a, b) => b.id - a.id)
    return [200, alltasks]
  })


}
