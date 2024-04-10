import {
  RadarChartOutlined,
  PieChartOutlined,
  MoneyCollectOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../AppContext';
import { ContextType } from '../../Reduser';
import { themeDef } from '../../styles/theme.app.def';
import Logo from './Logo';

type MenuItem = Required<MenuProps>['items'][number];

const siderCss: CSSProperties = {
  background: themeDef.antd.colorBgBase,
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem;
}

const AppSider: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedWidth, setCollapsedWidth] = useState(80); //Согласно доки по умолчанию
  const { state } = useContext<ContextType>(AppContext)
  const userRole = state?.profile?.user.role
  const navigate = useNavigate();
  const sider = state?.l.sider;
  const styleIco = { fontSize: '1.3rem' }
  const menuItems: MenuItem[] = [
    getItem(sider?.tasks, '/tasks', <RadarChartOutlined style={styleIco} />),
    getItem(sider?.priceComparator, '/pricecomparator', <MoneyCollectOutlined style={styleIco} />, [
      getItem(sider?.priceComparatorTemplate, '/pricecomparator/template'),

    ]),
    getItem(sider?.analytics, '/analytics', <PieChartOutlined style={styleIco} />),
  ];
  if (userRole === 'admin') {
      menuItems.push(getItem(sider?.adminPanel, '/users_list', <RadarChartOutlined style={styleIco} />));
    }


  return (
    <Layout.Sider theme='light' style={siderCss} width={themeDef.app.siderWidth} breakpoint="md"
      collapsedWidth={collapsedWidth} collapsible collapsed={collapsed}
      onBreakpoint={(value) => {
        if (value) setCollapsedWidth(0)
        else setCollapsedWidth(80)
      }}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: themeDef.app.headerHeight }}>
        <a style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingRight: !collapsed ? '4Rem' : 0 }} href="/">
          <Logo collapsed={collapsed} />
        </a>
      </div>
      <Menu defaultSelectedKeys={['1']} mode="inline" items={menuItems} onClick={(item) => {
        navigate(item.key, {});
      }}
      />
    </Layout.Sider>
  );
}

export default AppSider;
