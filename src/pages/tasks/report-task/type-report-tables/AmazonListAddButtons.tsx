import { AppstoreAddOutlined } from '@ant-design/icons';
import { App, Button } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { Link } from 'react-router-dom';
import { TaskApi } from '../../../../api/task.api.cli';
import { ApiError } from '../../../../shared.lib/api/errors';
import { AddTaskRequest, ITaskInfoRes } from '../../../../shared.lib/api/task.api';
import { IReadListFromUrlAMZResult, IReadUrlsEbay } from "../../../../shared.lib/api/task.data";
import { useContext } from 'react';
import { ContextType, GlobalState } from '../../../../Reduser';
import { AppContext } from '../../../../AppContext';

const addNewTask = async (data: ITaskInfoRes, message: MessageInstance,state:GlobalState) => {
  try {
    const rd = data.resultData as IReadListFromUrlAMZResult
    const inputData: IReadUrlsEbay = {
      urls: rd.map((v) => v.url)
    }

    const param: AddTaskRequest = {
      name: `${data.name}/readall`,
      desc: '',
      type: 'readAsinsAMZ',
      inputData
    }

    await TaskApi.addTask(param)

    message.success((<>
      <div>
      {state!.l.amazonEbayAddButtons.succAdd(param.name)}
      </div>
      <div>
        <Link to='tasks'> {state!.l.amazonEbayAddButtons.goToTask}</Link>
      </div>
    </>))

  } catch (error) {
    message.error(` ${state!.l.amazonEbayAddButtons.errorAddTask}` + ApiError.FromAxios(error))
  }
}



const AmazonListAddButtons: React.FC<{ data: ITaskInfoRes }> = ({ data }) => {
  const { message } = App.useApp();
  const { state } = useContext<ContextType>(AppContext);

  return (
    <>
      {/* <Button type="text" shape="round" icon={<AppstoreAddOutlined />} size='middle'
        onClick={() => addNewTask(data, message,state!)} >{state!.l.amazonEbayAddButtons.moreDetails}</Button> */}
    </>
  );
};

export default AmazonListAddButtons;
