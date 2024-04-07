import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Tasks from "../../pages/tasks/Tasks";
import Test from "../../pages/tasks/Test";
import ReportTask from "../../pages/tasks/report-task/ReportTask";
import NotFoundUrl from "../layout/NotFoundUrl";
import PriceComparatorTemplate from "../../pages/price-comparator/PriceComparatorTemplate";
import ResorceTemplate from "../../pages/price-comparator/ResorceTemplate";
import { AppSettig } from "../../app.setting";
import AdminPanel from "../admin/adminPanel";
import { ContextType } from "../../Reduser";
import { AppContext } from "../../AppContext";
import BlockedAccountPopup from "../blocked-popup/BlockedPopup";

const ContentRoutes: React.FC = () => {
  const { state } = useContext<ContextType>(AppContext);
  const userStatus = state?.profile?.user.status;

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" />} />
        <Route
          path="/tasks"
          element={
            userStatus === 1 ? (
              <BlockedAccountPopup />
            ) : (
              <Tasks />
            )
          }
        />
        <Route
          path="/inventory"
          element={
            userStatus === 1 ? (
              <BlockedAccountPopup />
            ) : (
              <Test />
            )
          }
        />
        <Route
          path="/pricecomparator/template"
          element={
            userStatus === 1 ? (
              <BlockedAccountPopup />
            ) : (
              <PriceComparatorTemplate />
            )
          }
        />
        <Route
          path="/tasks/report"
          element={
            userStatus === 1 ? (
              <BlockedAccountPopup />
            ) : (
              <ReportTask />
            )
          }
        />
        <Route
          path="/pricecomparator/template/create"
          element={
            userStatus === 1 ? (
              <BlockedAccountPopup />
            ) : (
              <ResorceTemplate editMode={false} />
            )
          }
        />
        <Route
          path={AppSettig.routePath.templateEdit}
          element={
            userStatus === 1 ? (
              <BlockedAccountPopup />
            ) : (
              <ResorceTemplate editMode={true} />
            )
          }
        />
        {/* <Route path="/create" element={<ASINTabTable />}></Route> */}
        <Route
          path="/test"
          element={
            userStatus === 1 ? (
              <BlockedAccountPopup />
            ) : (
              <Test />
            )
          }
        />
        <Route
          path="/users_list"
          element={
            userStatus === 1 ? (
              <BlockedAccountPopup />
            ) : (
              <AdminPanel />
            )
          }
        />
        <Route path="*" element={<NotFoundUrl />} />
      </Routes>
    </>
  );
};

export default ContentRoutes;