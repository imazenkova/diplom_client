import { App, Progress, Space } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../../../AppContext';
import { ContextType } from '../../../Reduser';
import { TaskApi } from '../../../api/task.api.cli';
import { tasksDb } from '../../../db/db';
import { ApiError } from '../../../shared.lib/api/errors';
import { ITaskInfoRes } from '../../../shared.lib/api/task.api';
import { PlusButtonTask } from '../Tasks';
import AmazonListAddButtons from './type-report-tables/AmazonListAddButtons';
import EbayListAddButtons from './type-report-tables/EbayListAddButtons';
import TestAddButtons from './type-report-tables/TestAddButtons';
import ViewAmazonPage from './type-report-tables/ViewAmazonPage';
import ViewResultTable from './type-report-tables/ViewResultTable';
import { comparePricesKeepaColumns } from './type-report-tables/columns-info/compare-prices-keepa-columns';
import { listAmzcolumns } from './type-report-tables/columns-info/list-amz-columns';
import { listEbaycolumns } from './type-report-tables/columns-info/list-ebay-columns';
import { pageAmzColumns } from './type-report-tables/columns-info/page-amz-columns';
import { pageEbayColumns } from './type-report-tables/columns-info/page-ebay-columns';
import { existListFromQuerySuplWBColumns } from './type-report-tables/columns-info/exist-list-from-query-supl-wb-columns';
import { listWbColumns } from './type-report-tables/columns-info/list-wb-columns';

interface RTData {
  err?: string,
  res?: ITaskInfoRes
}

const ReportTask: React.FC = () => {
  const { state } = useContext<ContextType>(AppContext);
  const location = useLocation();
  const [data, setData] = useState<RTData>();
  const [progress, setProgress] = useState(0);
  const { message } = App.useApp()

  const idParam = new URLSearchParams(location.search).get('id');
  const id = idParam ? parseInt(idParam) : -1;
  if (id < 0) message.error(state?.l.errors.taskNotFound)
  const uidCache = tasksDb.getUId(id, state?.profile?.user.email!)

  const errMessage = (error: any) => {
    console.error(error)
    message.error(<>{ApiError.FromAxios(error).getMessages().map(v => <>{v}<br /></>)}</>)
  }

  const onSaveResultData = async (taskInfoRes: ITaskInfoRes, resultData: any[]) => {
    try {
      await TaskApi.saveResultData(
        {
          id,
          resultData
        },
      )

      //Изменили кэш
      await tasksDb.tasks.delete(uidCache);
      await tasksDb.tasks.put({ id: uidCache, data: { ...taskInfoRes, resultData } });
    } catch (error) {
      errMessage(error)
    }
    finally {
      setProgress(0)
    }
  }

  useEffect(() => {
    const getData = async () => {
      setProgress(0.01)
      try {
        // Если данные уже есть в tasksDb, не делайте запрос к API
        const cacheRes = await tasksDb.tasks.get(uidCache)
        if (cacheRes) {
          setData({ res: cacheRes.data });
          return;
        }
        const res = await TaskApi.getTaskInfo(
          {
            id,
            fieldsAnswer: ['resultData', 'taskResult', 'resultErrors']
          },
          (p) => { if (progress === 0) setProgress((p.done / p.all) * 100) }
        )
        setData({ res })
        // Сохраните данные в tasksDb для кэширования
        if (res.resultData && res.resultData.length > 0)
          await tasksDb.tasks.put({ id: uidCache, data: res });

      } catch (error) {
        errMessage(error)
      }
      finally {
        setProgress(0)
      }
    }

    // Запускаем getData() только если taskFromDB определен или явно равен null
    getData();
  }, [location.search]);

  PlusButtonTask(state?.l!)

  const tableConfigurations = [
    <ViewAmazonPage key="readAsinsAMZ" data={data?.res!} onSave={onSaveResultData} />,
    <ViewAmazonPage key="readUrlsAMZ" data={data?.res!} onSave={onSaveResultData} />,
    <ViewResultTable key="readTestTask" columns={() => pageAmzColumns} resource="Test/Pages" data={data?.res!} onSave={onSaveResultData} />,
    <ViewResultTable key="readTestUnits" columns={() => pageAmzColumns} resource="Test/Pages" data={data?.res!} onSave={onSaveResultData} addButtonsComponent={<TestAddButtons />} />,
    <ViewResultTable key="readUrlsEbay" columns={() => pageEbayColumns} resource="EbayTable/Pages" data={data?.res!} onSave={onSaveResultData} />,
    <ViewResultTable key="readPagesFromSellerEbay" columns={() => pageEbayColumns} resource="EbayTable/Pages" data={data?.res!} onSave={onSaveResultData} />,
    <ViewResultTable key="readListFromUrlEbay" columns={() => listEbaycolumns} resource="EbayTable/List" data={data?.res!} onSave={onSaveResultData} addButtonsComponent={<EbayListAddButtons data={data?.res!} />} />,
    <ViewResultTable key="readListFromUrlAMZ" columns={() => listAmzcolumns} resource="AmzTable/List" data={data?.res!} onSave={onSaveResultData} addButtonsComponent={<AmazonListAddButtons data={data?.res!} />} />,
    <ViewResultTable key="comparePricesWithKeepa" columns={() => comparePricesKeepaColumns(state!)} resource="KeepaComparePrices" data={data?.res!} onSave={onSaveResultData} />,
    <ViewResultTable key="existListFromQuerySuplWB" columns={() => existListFromQuerySuplWBColumns(data?.res!, true)} resource="WB/ExistListFromQuery" data={data?.res!} />,
    <ViewResultTable key="posListFromQueryWB" columns={() => existListFromQuerySuplWBColumns(data?.res!)} resource="WB/PosListFromQuery" data={data?.res!} />,
    <ViewResultTable key="readListFromQueryWB" columns={() => listWbColumns} resource="WB/ReadListFromQuery" data={data?.res!} onSave={onSaveResultData} />
  ];

  return (
    <>
      {progress ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Space>
            <Progress type="circle" percent={Math.round(progress)} />
            {/* <Spin tip="Loading..." spinning={loading} size='large' /> */}
          </Space>
        </div>
      ) : null}

      {
        tableConfigurations.map(config =>
          <React.Fragment key={config.key}>
            {data?.res?.type === config.key && config}
          </React.Fragment>
        )
      }



      {/* <h1>Data err</h1>
      <pre>{data?.err}</pre>
      <h1>resultErrors</h1>
      <pre>{JSON.stringify(data?.res?.resultErrors, null, 2)}</pre>
      <h1>taskResult</h1>
      <pre>{JSON.stringify(data?.res?.taskResult, null, 2)}</pre>
      <h1>resultData</h1>
      <pre>{JSON.stringify(data?.res?.resultData, null, 2)}</pre> */}
    </>
  )
}
export default ReportTask;
