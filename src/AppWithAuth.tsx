import { Layout } from 'antd';
import React from 'react';
import AppContent from './components/layout/AppContent';
import AppFooter from './components/layout/AppFooter';
import AppHeader from './components/layout/AppHeader';
import AppSider from './components/layout/AppSider';
import { HeaderFooterProvider } from './components/layout/HeaderFooterContext';

const AppWithAuth: React.FC = () => {
  return (
    <>
      <Layout >
        <HeaderFooterProvider>
          <AppSider />
          <Layout>
            <AppHeader />
            <AppContent />
            <AppFooter />
          </Layout>
        </HeaderFooterProvider>
      </Layout>
    </>
  );
};


export default AppWithAuth;
