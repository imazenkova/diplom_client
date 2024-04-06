import { Layout } from 'antd';
import React from 'react';
import AuthRoutes from './components/routes/AuthRoutes';


const AppWithoutAuth: React.FC = () => {
  return (
    <>
      <Layout >
        <AuthRoutes />
      </Layout>
    </>
  );
};


export default AppWithoutAuth;
