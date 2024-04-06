import { useAppProps } from "antd/es/app/context";
import { MessageInstance } from 'antd/es/message/interface';
import { TaskApi } from '../../api/task.api.cli';
import { NotificationType } from "../../app.types";
import { ApiError } from '../../shared.lib/api/errors';
import { AddTaskRequest, TypeTask } from '../../shared.lib/api/task.api';
import { GlobalState } from "../../Reduser";



export interface AddTaskDlgProps {
  handleCancelDlg: () => void;
  handleDoneDlg: (type: NotificationType, msg: string, desc?: string) => void;
  useApp: useAppProps
  typeTask?: TypeTask
}


//Это входные данные на форму
export interface InputDataFormProps {
  inputData?: any
}

//Это выходные данные на форму
export interface InputDataFormRefs {
  getData: () => any
}


export const addNewTaskFromId = async (idTask: number, name:string, desc: string, message: MessageInstance,state:GlobalState) => {
  try {

    const data = await TaskApi.getTaskInfo({
      id: idTask,
      fieldsAnswer: ['inputData']
    });



    const param: AddTaskRequest = {
      name,
      desc: desc || '',
      type: data.type,
      inputData: data.inputData
    }

    await TaskApi.addTask(param)

    message.success((<>
      <div>
      {state.l.tasks.successAdd(param.name)}
      </div>
    </>))

  } catch (error) {
    message.error(`${state.l.amazonEbayAddButtons.errorAddTask}` + ApiError.FromAxios(error))
  }
}
