import { Content } from 'antd/es/layout/layout';
import React, { CSSProperties } from 'react';
import ContentRoutes from '../routes/ContentRoutes';
import { themeDef } from '../../styles/theme.app.def';


export const contentCss: CSSProperties = {
  background: themeDef.app.backgroundColor,
  height: '100vh',
  //display: 'flex',
  padding: '0.5rem 0.5rem',
  overflow: 'auto',
}


const AppContent: React.FC = () => (
  <Content style={contentCss}>
    <ContentRoutes />
  </Content>
);

export default AppContent;
