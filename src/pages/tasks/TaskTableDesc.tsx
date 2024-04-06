import { App, Descriptions, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalState } from '../../Reduser';
import { TaskApi } from '../../api/task.api.cli';
import { formatObj } from '../../components/utils/FormatObject';
import { ApiError } from '../../shared.lib/api/errors';
import { ITaskInfoRes, StateTask } from '../../shared.lib/api/task.api';

export interface TaskTableDescProps extends Pick<ITaskInfoRes, 'id'> {
  state: GlobalState;
}

const TaskTableDesc: React.FC<TaskTableDescProps> = ({ id, state }) => {
  const [data, setData] = useState<ITaskInfoRes>();
  const { message } = App.useApp();
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await TaskApi.getTaskInfo({
          id: id,
          fieldsAnswer: ['inputData', 'resultErrors', 'taskResult', 'resultDataInfo']
        });
        setData(result);
      } catch (error) {
        message.success(ApiError.FromAxios(error).getFullMessage(','), 20);
      }
    };

    fetchData();
  }, [id]);

  if (!data) {
    return <div>{state!.l.taskTableDesc.notAvailableInfo}</div>;
  }

  const diffInMilliseconds = data.timeEnd - data.timeStart;
  const diffInMinutes = diffInMilliseconds / (1000 * 60);
  const roundedDiff = Math.round(diffInMinutes * 10) / 10;
  const stateStr = `${data.state}: ` + state?.l.state[data.state]

  return (
    <>
      <Descriptions title={state!.l.taskTableDesc.taskInfo} layout="vertical">
        <Descriptions.Item label="Id" >{data.id}</Descriptions.Item>
        <Descriptions.Item label={state.l.columns.name}>{data.name}</Descriptions.Item>
        <Descriptions.Item label={state.l.columns.description}>{data.desc}</Descriptions.Item>
        <Descriptions.Item label={state!.l.taskTableDesc.typeOfTask}>{data.type}: {state.l.tasks.type[data.type]}</Descriptions.Item>
        <Descriptions.Item label={state!.l.taskTableDesc.stateOfTask}>{stateStr}</Descriptions.Item>
        <Descriptions.Item label={state!.l.columns.progress}>
          {data.proccess ? `${data.proccess.done} / ${data.proccess.all} (${parseFloat(((data.proccess.done / data.proccess.all) * 100).toFixed(2))}%)` : 'Not available'}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title="InputData" layout="vertical">
        <Descriptions.Item label="Input Data">{formatObj(data.inputData, App.useApp,state)}</Descriptions.Item>
      </Descriptions>

      <Descriptions title="Time" layout="vertical">
        <Descriptions.Item label="Creation time">{new Date(data.timeCreate!).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Start time">{new Date(data.timeStart!).toLocaleString()}</Descriptions.Item>
        {data.state >= StateTask.complite && <Descriptions.Item label="End time">{new Date(data.timeEnd!).toLocaleString()}</Descriptions.Item>}
        {data.state >= StateTask.complite && <Descriptions.Item label="Execution time">{roundedDiff} minutes</Descriptions.Item>}
      </Descriptions>


      {data.state >= StateTask.complite && <Descriptions title="Task Result" layout="vertical">
        {<Descriptions.Item label="Result Data"><Button type='link' onClick={() => nav(`/tasks/report?id=${id}`)}>Open</Button></Descriptions.Item>}
        {<Descriptions.Item label="Task Result [Count]">{data.resultDataInfo?.rowsCount}</Descriptions.Item>}
        {<Descriptions.Item label="Task Result [Date]">{new Date(data.resultDataInfo?.lastChange!).toLocaleString()}</Descriptions.Item>}
        {<Descriptions.Item label="Task Result [Obj]">{formatObj(data.taskResult, App.useApp,state)}</Descriptions.Item>}
      </Descriptions>}

      {data.state >= StateTask.complite && <Descriptions title="Task Result Error" layout="vertical">
        {data.state >= StateTask.complite && <Descriptions.Item label="Result Errors">{formatObj(data.resultErrors, App.useApp,state)}</Descriptions.Item>}
      </Descriptions>}

    </>
  );
};

export default TaskTableDesc;
