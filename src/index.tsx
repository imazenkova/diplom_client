import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
//import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from "react-router-dom";
import { startServiceMock } from './api/mock/mock';
import { AppSettig } from './app.setting';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


//Запуск заглушечных серверов для того чтобы не вызывать api
if (AppSettig.Mode === 'dev') startServiceMock()

root.render(
  // <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  // </React.StrictMode>
);

//reportWebVitals();
