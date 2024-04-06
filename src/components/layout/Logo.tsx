import { HeatMapOutlined } from '@ant-design/icons';
import React from 'react';
import { CSSU, themeDef } from '../../styles/theme.app.def';
import { buttonRightIcon } from './AppHeader.style';


const Logo: React.FC<{ collapsed: boolean }> = (props) => {
  const { collapsed } = props
  return <>
    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', paddingLeft: '0.8rem', color: themeDef.antd.colorPrimary }}>
      {!collapsed && <span style={{ color: themeDef.app.logoPrimaryColor, fontSize: '1.1rem' }}>ASIN </span>}
      <HeatMapOutlined style={{ transform: 'rotate(20deg)', fontSize: CSSU.calc(buttonRightIcon.fontSize, v => v * 1.2), color: themeDef.app.logoPrimaryColor }} />
      {!collapsed && <span style={{}}>e<span style={{}}>X</span>pert</span>}
    </span>
  </>
}

export default Logo;


