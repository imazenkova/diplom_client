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
import { App, Button } from 'antd';
import { ApiError } from '../../shared.lib/api/errors';
import { ContextType, State } from '../../Reduser';
import { AppContext } from '../../AppContext';
import { ITaskInfo } from '../../shared.lib/api/task.api';
import { useLocation, useNavigate } from 'react-router-dom';

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

  interface AnalyticsProps {
    id?: number;
  }
  const Analytics: React.FC<AnalyticsProps> = (props) => {
    const {id}= props;
    const [allTasks, setTasks] = useState<TaskCount[]>([]);
    const { message } = App.useApp();
    const { state, dispatch } = useContext<ContextType>(AppContext);
    let userId = state?.profile?.user.id!;
    const typesLocal= state?.l.tasks.type;
    
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const userIDParam = params.get('userId')

    const navigate = useNavigate()
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await TaskApi.getListTaskInfo({id:userIDParam});
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

    for (let i = 0; i < typesArray.length; i++) {
      switch (typesArray[i]) {
        case "none":
          typesArray[i] = typesLocal?.none!;
          break;
        case "readTestTask":
          typesArray[i] = typesLocal?.readTestTask!;
          break;
        case "readTestUnits":
          typesArray[i] = typesLocal?.readTestUnits!;
          break;
        case "readAsinsAMZ":
          typesArray[i] = typesLocal?.readAsinsAMZ!;
          break;
        case "readUrlsAMZ":
          typesArray[i] = typesLocal?.readUrlsAMZ!;
          break;
        case "readListFromUrlAMZ":
          typesArray[i] = typesLocal?.readListFromUrlAMZ!;
          break;
        case "readUrlsEbay":
          typesArray[i] =typesLocal?.readUrlsEbay!;
          break;
        case "readListFromUrlEbay":
          typesArray[i] =typesLocal?.readListFromUrlEbay!;
          break;
        case "readPagesFromSellerEbay":
          typesArray[i] = typesLocal?.readPagesFromSellerEbay!;
          break;
        case "comparePricesWithKeepa":
          typesArray[i] = typesLocal?.comparePricesWithKeepa!;
          break;
        case "readListFromQueryWB":
          typesArray[i] =typesLocal?.readListFromQueryWB!;
          break;
        case "existListFromQuerySuplWB":
          typesArray[i] =typesLocal?.existListFromQuerySuplWB!;
          break;
        case "posListFromQueryWB":
          typesArray[i] = typesLocal?.posListFromQueryWB!;
          break;
        default:
          break;
      }
    }
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
        <div  style={{
      height: '100%', width: '50%',
    }}><Doughnut data={data} /></div>
        <div>
          <Button onClick={ ()=>{navigate(`/tasks?userId=${userId}`)}}>Open Tasks</Button>
        </div>

    </div>
  );
};

export default Analytics;