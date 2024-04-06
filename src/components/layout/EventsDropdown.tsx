import { BellOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Badge, Button, Dropdown, Pagination, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import { NotificationApi } from '../../api/notification.api.cli';
import { INotification } from '../../shared.lib/api/notification.api';
import { themeDef } from '../../styles/theme.app.def';
import { buttonRightIcon, headerBtn } from './AppHeader.style';
import { toNotificationMessage } from './EventsDropdown.types';

export const contentStyleRenderDD: React.CSSProperties = {
  backgroundColor: themeDef.antd.colorBgElevated,
  borderRadius: themeDef.antd.borderRadiusLG,
  boxShadow: themeDef.antd.boxShadowSecondary,
  padding: '0.2rem'
};

const PAGE_SIZE = 15;
const WIDTH_TABLE = '35rem'
const UPDATE_INTERVAL = 10000

const EventsDropdown: React.FC = () => {
  const { state } = useContext<ContextType>(AppContext)
  const nav = useNavigate()
  const [badgeCount, setBadgeCount] = useState(0)
  const [data, setData] = useState<INotification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0); // total number of records
  const [loading, setLoading] = useState(false);

  const columns: ColumnsType<INotification> = [
    { title: '', dataIndex: 'confirmed', width: '1.2rem', render: (confirmed) => !confirmed ? <Badge dot /> : null },
    { title: `${state!.l.notif.date}`, dataIndex: 'created_at', width: '9rem', render: (date: Date) => new Date(date).toLocaleString('ru-RU') },
    { title: `${state!.l.notif.msg}`, dataIndex: 'message', render: (msg: string, row) => toNotificationMessage(row, state!, nav) },
  ];

  columns.forEach(v => {
    v.ellipsis = true
  })

  const handleConfirmAll = async () => {
    try {
      const res = await NotificationApi.confirmNotificationsBeforeDate({
        dateBefore: new Date(0)
      });
      setBadgeCount(res.count);

      loadData(currentPage);
    } catch (error) {
      console.error(error);
    }
  }

  const loadData = async (page: number = 1) => {
    setLoading(true);
    try {
      const offset = (page - 1) * PAGE_SIZE;
      const res = await NotificationApi.getNotifications({
        limit: PAGE_SIZE,
        offset,
        dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      });
      setData(res.notifications);
      setTotal(res.total); // assuming `res.total` is the total count of records

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    try {
      const cofns = data.filter(v => !v.confirmed)
      if (cofns.length === 0) return
      const unconfirmCount = await NotificationApi.confirmManyNotifications({
        ids: data.map(v => v.id)
      });

      setBadgeCount(unconfirmCount.count)
    } catch (error) {
      console.error(error);
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadData(page);
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await NotificationApi.getUnconfirmedNotificationCount()
        setBadgeCount(res.count)
      } catch (error) {
        console.error(error)
      }
    }

    getData();
    loadData(currentPage);

    const timer = setInterval(() => {
      getData();
    }, UPDATE_INTERVAL);
    return () => clearInterval(timer);

  }, [currentPage]);

  return (
    <>
      <Badge count={badgeCount} overflowCount={150} offset={[-7, 8]}>
        <Dropdown
          arrow={{ pointAtCenter: true }}
          dropdownRender={(c) =>
            <div style={contentStyleRenderDD}>
              <Table showHeader={false} loading={loading} size="small" columns={columns} dataSource={data} pagination={false} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={PAGE_SIZE}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showLessItems
                />
                <Tooltip title={state?.l.notif.confirmAll}>
                  <Button onClick={handleConfirmAll} type="text" icon={<CheckCircleOutlined />} style={{ marginRight: '1rem' }} />
                </Tooltip>
              </div>
            </div>}
          trigger={['click']}
          overlayStyle={{ width: WIDTH_TABLE }}
          placement="bottomRight"
          onOpenChange={(open) => { if (open) loadData(currentPage); }}
        >
          <Button type='text' style={headerBtn}>
            <BellOutlined style={buttonRightIcon} />
          </Button>
        </Dropdown>
      </Badge>
    </>
  );
};

export default EventsDropdown;
