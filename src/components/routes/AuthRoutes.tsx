import React from 'react';
import { Route, Routes } from "react-router-dom";
import AuthComponent from '../../pages/auth/auth';
import { AppSettig } from '../../app.setting';

const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={AppSettig.routePath.auth} element={<AuthComponent />}>
      </Route>
    </Routes>
  )
};

export default AuthRoutes;
