import React, {useContext, useEffect, useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
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
import { App, Button, Empty } from 'antd';
import { ApiError } from '../../shared.lib/api/errors';
import { ContextType, State } from '../../Reduser';
import { AppContext } from '../../AppContext';
import { ITaskInfo } from '../../shared.lib/api/task.api';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthApi } from '../../api/auth.api.cli';

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

  type TaskCountByType = {
    type: string;
    count: number;
  };

  type TaskCountByDate = {
    date: string;
    count: number;
  };

  interface AnalyticsProps {
    id?: number;
  }
  const Analytics: React.FC<AnalyticsProps> = (props) => {
    const {id}= props;
    const [allTasks, setTasks] = useState<TaskCountByType[]>([]);
    const [allTasksByDate, setTasksByDate] = useState<TaskCountByDate[]>([]);
    const { message } = App.useApp();
    const { state, dispatch } = useContext<ContextType>(AppContext);
    let userId = state?.profile?.user.id!;
    const typesLocal= state?.l.tasks.type;
  
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const userIDParam =Number( params.get('userId'))

    const navigate = useNavigate()
    const fetchData = async () => {
      try {
        const result = await TaskApi.getListTaskInfo({id:userIDParam});
        const countTasksByType = result.reduce((accumulator:any, currentObject) => {
        const existingObject:any = accumulator.find((obj:ITaskInfo )=> obj.type === currentObject.type);

          if (existingObject) {
            existingObject.count++;
          } else {
            accumulator.push({ type: currentObject.type, count: 1 });
          }
        
          return accumulator;
        }, []);
        setTasks(countTasksByType);

        const tasksCopy= result as any ;
        const newArray = tasksCopy.map((currentObject:any) => {
          const date = new Date(currentObject.timeCreate);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = String(date.getFullYear()).slice(-2);
          const formattedDate = `${day}/${month}/${year}`;
        
          return { ...currentObject, date: formattedDate };
        });

        const countTasksByDate = newArray.reduce((accumulator:any, currentObject:any) => {
          const { date } = currentObject;
        
          if (date in accumulator) {
            accumulator[date].count++;
          } else {
            accumulator[date] = { date, count: 1 };
          }
        
          return accumulator;
        }, {});
        
        setTasksByDate(countTasksByDate);
        
      } catch (error) {
        message.success(ApiError.FromAxios(error).getFullMessage(','), 20);
      }
    };

    useEffect(() => {
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

    const countTasksByType: number[] = allTasks.map(obj => obj.count);

    const data = {
        labels: typesArray,
        datasets: [
          {
            data: countTasksByType,
            backgroundColor: ['#ff0000', '#00ff00', '#0000ff','#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#0080ff', '#8000ff', '#ff0080', '#80ff00', '#008000', '#800000'],
          },
        ],
      };


       const optionsLine = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: `${state?.l.analytics.activity}`,
          },
        },
      };

      const countTaskByDate: number[] = Object.values(allTasksByDate).map((obj) => obj.count);
    
      const dateArray: string[] = Object.values(allTasksByDate).map((obj) => obj.date);
   
       const dataLine= {
        labels:dateArray.reverse(),
        datasets: [
          {
            label: `${state?.l.analytics.activity}`,
            data:countTaskByDate.reverse(),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ],
      };

  return (
    <div>
      {countTaskByDate.length === 0 ?(
        <div 
        style={{paddingBottom:'1%',display:"flex",justifyContent:'center'}}><h3>{state?.l.analytics.noTasks}</h3></div>):(<></>)}
      
    <div 
    style={{paddingBottom:'1%',display:"flex",justifyContent:'center'}}>
    <Button onClick={ ()=>{navigate(`/tasks?userId=${userId}`)}}>{state?.l.analytics.openTasks}</Button>

</div>

    <div
    style={{
      height: '100%', width: '100%',
      backgroundColor: themeDef.app.backgroundColor, boxShadow: themeDef.antd.boxShadowSecondary,
      borderRadius: themeDef.antd.borderRadius,
      display: 'flex',
      flexDirection: 'row',
    }} >

      {countTaskByDate.length === 0 ?(
       <></>
      ):(
        <>   <div  style={{
          height: '100%', width: '50%',
          alignContent:'center', 
        }}>
          <Doughnut data={data} />
    
        </div>
        <div  style={{
          height: '100%', width: '50%',
          alignContent:'center', 
        }}>
      <Line options={optionsLine} data={dataLine} />
        </div></>
      )}
     

  </div>
  </div>
  );
};

export default Analytics;