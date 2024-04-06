import { App as AppAntd, ConfigProvider, Spin } from 'antd';
import React, { useEffect, useReducer, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { AppContext } from './AppContext';
import AppWithAuth from './AppWithAuth';
import AppWithoutAuth from './AppWithoutAuth';
import { GlobalState, State, appReducer } from './Reduser';
import { AuthApi } from './api/auth.api.cli';
import { langAntd } from './locales/lang';
import './styles/tabulator_bootstrap4.css';
import { themeDef } from './styles/theme.app.def';
import { AppSettig } from './app.setting';

const App: React.FC = () => {
  //STATE dispatch это функция appReducer
  const [state, dispatch] = useReducer(appReducer, new GlobalState());
  const [loading, setLoading] = useState(true); // <-- состояние загрузки
  const value = { state, dispatch };
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const redirectURL = location.pathname + location.search;
    dispatch({ type: State.REDIRECT_URL, payload: redirectURL });
    AuthApi.getProfile()
      .then((response) => {
        dispatch({ type: State.PROFILE, payload: response });
        setLoading(false);
      })
      .catch((error) => {
        dispatch({ type: State.LOGOUT });
        navigate(AppSettig.routePath.auth);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
  }, [state.profile]);

  return (
    <ConfigProvider locale={state.profile ? (langAntd as any)[state.profile?.user.lang as string] : langAntd.en}
      theme={themeDef.theme}>
      <AppAntd>
        <AppContext.Provider value={value}>
          <div className="container">
            {loading ? (
              <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
            ) : (
              GlobalState.isAuth(state) ? <AppWithAuth /> : <AppWithoutAuth />
            )}
          </div>
        </AppContext.Provider>
      </AppAntd>
    </ConfigProvider>
  );
};

export default App;
