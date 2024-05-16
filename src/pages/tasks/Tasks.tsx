import { AmazonOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import { App, Menu, MenuProps, notification } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import { NotificationType } from '../../app.types';
import { buttonLeftIcon } from '../../components/layout/AppHeader.style';
import { useHeaderMenu } from '../../hooks/useMenu';
import { Translation } from '../../locales/lang';
import { TypeTask, toTypeTask } from '../../shared.lib/api/task.api';
import { ReactComponent as EBayIcon } from './../../assets/ebay-icon.svg';
import { ReactComponent as WBIcon } from './../../assets/wb-icon.svg';
import TasksTable from './TasksTable';
import AddASINsAmzForm from './add-form-task/AddAsinsAmzForm';
import AddListFromUrlAmzForm from './add-form-task/AddListFromUrlAmzForm';
import AddListFromUrlEbayForm from './add-form-task/AddListFromUrlEbayForm';
import AddTestTaskForm from './add-form-task/AddTestTaskForm';
import AddURLsAmzForm from './add-form-task/AddURLsAmzForm';
import AddURLsEbayForm from './add-form-task/AddURLsEbayForm';
import AddTestUnitsForm from './add-form-task/AddTestUnitsForm';
import AddComparePricesWithKeepaForm from './add-form-task/AddComparePricesWithKeepaForm';
import AddExistListFromQuerySuplWBForm from './add-form-task/AddExistListFromQuerySuplWBForm';
import AddPosListFromQueryWBForm from './add-form-task/AddPosListFromQueryWBForm';
import AddReadListFromQueryWBForm from './add-form-task/AddReadListFromQueryWBForm';

const addTaskMenu = (loc: Translation, nav: NavigateFunction): MenuProps['items'] => [
  {
    label: 'WB',
    key: 'WBMenu',
    icon: <WBIcon style={buttonLeftIcon} />,
    children: [
      { key: 'wb1', label: loc.tasks.type.readListFromQueryWB, onClick: () => nav('/tasks?addtype=readListFromQueryWB') },
      { key: 'wb2', label: loc.tasks.type.posListFromQueryWB, onClick: () => nav('/tasks?addtype=posListFromQueryWB') },
      { key: 'wb3', label: loc.tasks.type.existListFromQuerySuplWB, onClick: () => nav('/tasks?addtype=existListFromQuerySuplWB') },
    ]
  },
  {
    label: 'Amazon',
    key: 'AmazonMenu',
    icon: <AmazonOutlined style={buttonLeftIcon} />,
    children: [
      { key: 'amz1', label: loc.tasks.type.readUrlsAMZ, onClick: () => nav('/tasks?addtype=readUrlsAMZ') },
      { key: 'amz2', label: loc.tasks.type.readAsinsAMZ, onClick: () => nav("/tasks?addtype=readAsinsAMZ") },
      { key: 'amz3', label: loc.tasks.type.readListFromUrlAMZ, onClick: () => nav("/tasks?addtype=readListFromUrlAMZ") },
    ]
  },
  {
    label: 'eBay',
    key: 'eBayMenu',
    icon: <EBayIcon style={buttonLeftIcon} />,
    children: [
      { key: 'ebay1', label: loc.tasks.type.readUrlsEbay, onClick: () => nav("/tasks?addtype=readUrlsEbay") },
      { key: 'ebay2', label: loc.tasks.type.readListFromUrlEbay, onClick: () => nav("/tasks?addtype=readListFromUrlEbay") },
      { key: 'ebay3', label: loc.tasks.type.readPagesFromSellerEbay, onClick: () => nav("/tasks?addtype=readPagesFromSellerEbay") },
    ],
  },
  // {
  //   label: loc.priceCmp.topMenuLabel,
  //   key: 'priceCompMenu',
  //   icon: <MoneyCollectOutlined style={buttonLeftIcon} />,
  //   children: [
  //     { key: 'priceCmp', label: loc.tasks.type.comparePricesWithKeepa, onClick: () => nav("/tasks?addtype=comparePricesWithKeepa") },
  //   ],
  // },
  //только в режиме дебаг
  // {
  //   label: 'Test',
  //   key: 'TestMenu',
  //   children: [
  //     { key: 'test1', label: loc.tasks.type.readTestTask, onClick: () => nav("/tasks?addtype=readTestTask") },
  //     { key: 'test2', label: loc.tasks.type.readTestUnits, onClick: () => nav("/tasks?addtype=readTestUnits") },
  //   ],
  // },

];

export const PlusButtonTask = (loc: Translation) => {
  const nav = useNavigate();
  const { state } = useContext<ContextType>(AppContext);
const userId= state?.profile?.user.id;
const location = useLocation();
const params = new URLSearchParams(location.search);
const userIDParam =Number( params.get('userId')) || userId

  //Добавили кнопку в хедар меню
  useHeaderMenu({
    items: [{
      key: '  _1', val: <>
  {userId===userIDParam? (
  <Menu style={{ minWidth: '100vh' }} items={addTaskMenu(loc, nav)} triggerSubMenuAction='click' mode="horizontal" />
) : null}
      </>
    }]
  })
}

const Tasks: React.FC = () => {
  const { state } = useContext<ContextType>(AppContext)
  const useApp = App.useApp()

  const location = useLocation();
  // ===================== Hooks =====================
  const [api, contextHolder] = notification.useNotification();
  const [addType, setAddType] = useState<TypeTask>('none');
  // Вызываем когда необходимо обновить таблицу
  const [refreshTable, setRefreshTable] = useState(false);

  const navigate = useNavigate();

  // ===================== Effect =====================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tType = toTypeTask(params.get('addtype'))
    setAddType(tType); //Задается в menuitems

  }, [location]);

  const notificationWithIcon = (type: NotificationType, message: string, description: string) => {
    api[type]({ placement: 'top', message, description })
  };

  const deleteAddTypeURL = () => {
    const params = new URLSearchParams(location.search);
    params.delete('addtype'); // удалить параметр 'addtype'
    navigate({ ...location, search: params.toString() }); // обновить URL
    setRefreshTable(!refreshTable)
  }

  // ===================== Handlers =====================
  //Результаты вополнения диалога
  const handleCancelDlg = () => {
    deleteAddTypeURL()
  };

  const handleDoneDlg = (type: NotificationType, msg: string, desc?: string) => {
    notificationWithIcon(type, msg, desc || '')
    deleteAddTypeURL()
  };


  PlusButtonTask(state?.l!)

  return (<>
    {contextHolder}

    {addType === "readAsinsAMZ" && <AddASINsAmzForm useApp={useApp} handleCancelDlg={handleCancelDlg} handleDoneDlg={handleDoneDlg} />}
    {addType === "readUrlsAMZ" && <AddURLsAmzForm useApp={useApp} handleCancelDlg={handleCancelDlg} handleDoneDlg={handleDoneDlg} />}
    {addType === "readTestTask" && <AddTestTaskForm useApp={useApp} handleCancelDlg={handleCancelDlg} handleDoneDlg={handleDoneDlg} />}
    {addType === "readTestUnits" && <AddTestUnitsForm useApp={useApp} handleCancelDlg={handleCancelDlg} handleDoneDlg={handleDoneDlg} />}
    {addType === "readUrlsEbay" && <AddURLsEbayForm useApp={useApp} handleCancelDlg={handleCancelDlg} handleDoneDlg={handleDoneDlg} />}
    {addType === "readListFromUrlEbay" && <AddListFromUrlEbayForm useApp={useApp} handleCancelDlg={handleCancelDlg} handleDoneDlg={handleDoneDlg} />}
    {addType === "readListFromUrlAMZ" && <AddListFromUrlAmzForm useApp={useApp} handleCancelDlg={handleCancelDlg} handleDoneDlg={handleDoneDlg} />}
    {addType === "readPagesFromSellerEbay" && <AddListFromUrlEbayForm useApp={useApp} typeTask='readPagesFromSellerEbay' handleCancelDlg={handleCancelDlg} handleDoneDlg={handleDoneDlg} />}
    {addType === "comparePricesWithKeepa" && <AddComparePricesWithKeepaForm useApp={useApp} handleCancelDlg={handleCancelDlg} handleDoneDlg={handleDoneDlg} />}
    {addType === "existListFromQuerySuplWB" && <AddExistListFromQuerySuplWBForm useApp={useApp} handleCancelDlg={handleCancelDlg} handleDoneDlg={handleDoneDlg} />}
    {addType === "posListFromQueryWB" && <AddPosListFromQueryWBForm useApp={useApp} handleCancelDlg={handleCancelDlg} handleDoneDlg={handleDoneDlg} />}
    {addType === "readListFromQueryWB" && <AddReadListFromQueryWBForm useApp={useApp} handleCancelDlg={handleCancelDlg} handleDoneDlg={handleDoneDlg} />}

    <TasksTable refresh={refreshTable} notificationApp={notificationWithIcon} />
  </>
  )
}
export default Tasks;
