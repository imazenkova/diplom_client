import React, {useContext, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    ArcElement
  } from 'chart.js';
  import { themeDef } from '../../styles/theme.app.def';
import { TaskApi } from '../../api/task.api.cli';
import { ITaskInfoRes } from '../../shared.lib/api/task.api';
import { App } from 'antd';
import { ApiError } from '../../shared.lib/api/errors';
import { ContextType, State } from '../../Reduser';
import { AppContext } from '../../AppContext';
import { ITaskInfo } from '../../shared.lib/api/task.api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ArcElement
  );

  type TaskCount = {
    type: string;
    count: number;
  };

const Analytics = () => {
    const [allTasks, setTasks] = useState<TaskCount[]>([]);
    const { message } = App.useApp();
    const { state, dispatch } = useContext<ContextType>(AppContext);
    const userId = state?.profile?.user.id!;
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await TaskApi.getListTaskInfo({ });
          const count = result.reduce((accumulator:any, currentObject) => {
            const existingObject:any = accumulator.find((obj:ITaskInfo )=> obj.type === currentObject.type);
          
            if (existingObject) {
              existingObject.count++;
            } else {
              accumulator.push({ type: currentObject.type, count: 1 });
            }
          
            return accumulator;
          }, []);
          setTasks(count);
        } catch (error) {
          message.success(ApiError.FromAxios(error).getFullMessage(','), 20);
        }
      };
    
     
      fetchData();
    }, [userId]);

    const typesArray: string[] = allTasks.map(obj => obj.type);
    const countArray: number[] = allTasks.map(obj => obj.count);
    const data = {
        labels: typesArray,
        datasets: [
          {
            data: countArray,
            backgroundColor: ['#ff0000', '#00ff00', '#0000ff','#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#0080ff', '#8000ff', '#ff0080', '#80ff00', '#008000', '#800000'],
          },
        ],
      };

  return (
    <div
    style={{
      height: '100%', width: '100%',
      backgroundColor: themeDef.app.backgroundColor, boxShadow: themeDef.antd.boxShadowSecondary,
      borderRadius: themeDef.antd.borderRadius
    }} >
      <Doughnut data={data} />
    </div>
  );
};

export default Analytics;