import { PoweroffOutlined, RetweetOutlined } from '@ant-design/icons';
import { App, Button, Form, FormInstance, Input, InputRef, Progress, Table, Space, TableColumnsType,  TableColumnType } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import { TaskApi } from '../../api/task.api.cli';
import { NotificationApp } from '../../app.types';
import { IProccessInfo, ITaskInfo, StateTask, StateTaskUls, TypeTask } from '../../shared.lib/api/task.api';
import TaskTableDesc from './TaskTableDesc';
import { addNewTaskFromId } from './Tasks.types';
import { BaseTaskForm } from './add-form-task/BaseTaskForm';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";

interface DataType {
  key: string;
  type:string;
  name: string;
}

type DataIndex = keyof DataType;


//const PAGE_SIZE = 10
const TasksTable: React.FC<{ refresh: boolean, notificationApp: NotificationApp }> = ({ refresh, notificationApp }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  
  const [data, setData] = useState<ITaskInfo[]>([]); // Инициализируем state для данных
  const { state } = useContext<ContextType>(AppContext);
  const navigate = useNavigate()
  const { modal, message } = App.useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  let idTask = -1
  if (location.search) {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id')
    if (idParam !== null) idTask = Number(idParam)
  }

  const onRepeat = (taskInfo: ITaskInfo) => {
    const formRef = React.createRef<FormInstance>();

    modal.confirm({
      title: state?.l.tasks.addTaskTitle,
      width: BaseTaskForm.defaultWidth,

      icon: null,
      onOk: async () => {
        try {
          await formRef.current?.validateFields()
        }
        catch {
          message.error(state!.l.tasks.requiredParams)
          return
        }

        const vals = formRef.current?.getFieldsValue()
        await addNewTaskFromId(taskInfo.id, vals.name, vals.desc, message, state!)
      },
      content: <>

        <Form
          ref={formRef}
          layout="vertical"
          size='middle'
          initialValues={{ name: taskInfo.name, desc: taskInfo.desc }}>
          {BaseTaskForm.itemName(state?.l!)}
          {BaseTaskForm.itemDesc(state?.l!)}

        </Form>

      </>,
    })

    //addNewTaskFromId(row.id, '', message)
  }



  const onViewInParam = (id: number) => {
    modal.success({
      //title: 'Task Info',
      width: 1000,
      icon: null,
      transitionName: '',
      content: <>
        <TaskTableDesc id={id} state={state!} />
      </>,
    })
  }

  const onChange: TableProps<ITaskInfo>['onChange'] = (pagination, filters, sorter, extra) => {

    setCurrentPage(pagination.current!);
    setPageSize(pagination.pageSize!);

    if (idTask >= 0) {
      const params = new URLSearchParams(location.search);
      params.delete('id');
      navigate(`${location.pathname}?${params.toString()}`);
    }
  };
  const fetchData = async (searchQuery:string) => {
    // Предположим, что это API вызов для получения данных
    const result = await TaskApi.getListTaskInfo({
       state: [0],//, StateTaskUls.lessIsNotComplite() - 1]
       name:searchQuery
    });

    //const result = await TaskApi.getActiveListTaskInfo();
    setData(result.map(v => { return { ...v, key: v.id } })); // Задаем данные, полученные из API
  };

  useEffect(() => {
  
    fetchData(searchQuery);

    const interval = setInterval(fetchData, 2000); // обновляет данные каждые 2 секунд
    return () => clearInterval(interval); // очищает таймер при размонтировании компонента
  }, [refresh,searchQuery]);

  useEffect(() => {
    if (idTask >= 0) {
      const indx = data.findIndex(v => v.id === idTask)
      const pageForId = Math.ceil((indx + 1) / pageSize);
      setCurrentPage(pageForId);
    }

  }, [location.search, data])
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<any> = [
    { title: 'Id', dataIndex: 'id' },
    { title: `${state!.l.columns.name}`, dataIndex: 'name',  ...getColumnSearchProps('name'), },
    // {title: 'TimeStart', dataIndex: 'timeStart',render: (data: number) => data ? new Date(data).toLocaleString() : '',},
    { title: 'TypeTask', dataIndex: 'type', render: (t: TypeTask) => state?.l.tasks.type[t] , ...getColumnSearchProps('type'),},
    {
      title: `${state!.l.columns.state}`, dataIndex: 'state', key: 'state',
      render: (s: number) => {
        const st = state?.l.state[s as StateTask]
        if (!st) return ''
        return st
      }
    },
    {
      title: `${state!.l.columns.progress}`, dataIndex: 'proccess', key: 'progress',
      render: (proccess: IProccessInfo, row) => {

        if (!proccess) return 'NOT'

        let progressStatus: "success" | "exception" | "normal" | "active" | undefined = 'success'

        if (row.state !== StateTask.complite) {
      
          if (row.state === StateTask.complite_err) progressStatus = 'exception'
          else if (row.state === StateTask.cancel) progressStatus = 'exception'
          else if (row.state === StateTask.proccess) progressStatus = 'normal'
        }

        const taskRow = data.find(obj => obj.id === row.id);
       
        if(taskRow?.resultErrors && taskRow?.resultErrors.length> 0){
          progressStatus = 'exception'
        }


        return <Progress size={'small'} status={progressStatus}
         /*type="circle"*/ percent={parseFloat(((proccess.done / proccess.all) * 100).toFixed(0))} />
      }
    },
    {
      title: `${state!.l.columns.state}`, dataIndex: 'state', key: 'view',
      render: (stateNum: number, row) =>
        <Button type='text' disabled={!StateTaskUls.isComplite(stateNum)}
          onClick={() => navigate(`/tasks/report?id=${row.id}`)}>
          {state!.l.columns.report}
        </Button>,
    },
    {
      title: `${state!.l.tasks.more}`, dataIndex: 'state', key: 'inparam',
      render: (_, row) =>
        <Button type='text'
          onClick={() => onViewInParam(row.id)} >
          {state!.l.tasks.more}
        </Button>,
    },
    {
      title: `${state!.l.columns.repeat}`, dataIndex: 'state', key: 'view',
      render: (state: number, row) =>
        <Button disabled={!StateTaskUls.isComplite(state)} icon={<RetweetOutlined />}
          onClick={() => onRepeat(row)}>
        </Button>,
    },
    {
      title: `${state!.l.columns.cancel}`, dataIndex: 'state', key: 'cancel',
      render: (stateParam: any, render) => {
        return <Button disabled={StateTaskUls.isComplite(stateParam)} icon={<PoweroffOutlined />}
          loading={stateParam === StateTask.cancel_request}
          onClick={async () => {
            try {
              await TaskApi.cancel({ id: render.id });
            } catch (error) {
              notificationApp('error', `${state!.l.tasks.canceledTask}`, `${error}`)
            }
          }} />
      }
    },
  ];

  return (<>
        {/* <Input.Search
  placeholder="Поиск задач"
  value={searchQuery}
  onChange={e => setSearchQuery(e.target.value)}
  onSearch={() => fetchData(searchQuery)}
/> */}
    <Table key={'all-tab'} columns={columns} size='large' style={{ height: '100%' }}
      dataSource={data} onChange={onChange}
      pagination={{ current: currentPage, pageSize: pageSize, total: data.length }} // добавлено свойство пагинации
      rowClassName={(record) => (record.id === idTask ? 'ant-table-row-selected' : '')}
    />
  </>
  )
}
export default TasksTable;
