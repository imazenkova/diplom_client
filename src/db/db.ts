import Dexie, { Table } from 'dexie';
import { ITaskInfoRes } from '../shared.lib/api/task.api';

export interface ITaskDb {
  id: string;
  data: ITaskInfoRes;
}

class TasksDatabase extends Dexie {
  tasks: Table<ITaskDb, string>; // number предполагает, что тип ID - это число

  constructor() {
    super("TasksDB");
    this.version(1).stores({
      tasks: 'id, data'
    });

    this.tasks = this.table("tasks");
  }

  getUId(idTask: number, userEmail: string) {
    return `${idTask}-${userEmail}`
  }

}

export const tasksDb = new TasksDatabase();
