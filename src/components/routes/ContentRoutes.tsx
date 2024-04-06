import { Navigate, Route, Routes } from "react-router-dom";
import Tasks from "../../pages/tasks/Tasks";
import Test from "../../pages/tasks/Test";
import ReportTask from "../../pages/tasks/report-task/ReportTask";
import NotFoundUrl from "../layout/NotFoundUrl";
import PriceComparatorTemplate from "../../pages/price-comparator/PriceComparatorTemplate";
import ResorceTemplate from "../../pages/price-comparator/ResorceTemplate";
import { AppSettig } from "../../app.setting";

const ContentRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to="/tasks" />} />
        <Route path="/tasks" element={<Tasks />}></Route>
        <Route path="/inventory" element={<Test />}></Route>
        <Route path="/pricecomparator/template" element={<PriceComparatorTemplate />}></Route>
        <Route path="/tasks/report" element={<ReportTask />}></Route>
        <Route path="/pricecomparator/template/create" element={<ResorceTemplate editMode={false} />}></Route>
        <Route path={AppSettig.routePath.templateEdit} element={<ResorceTemplate editMode={true} />}></Route>
        {/* <Route path="/create" element={<ASINTabTable />}></Route> */}
        <Route path="/test" element={<Test />}></Route>
        <Route path="*" element={<NotFoundUrl />} />
      </Routes>
    </>
  )
};

export default ContentRoutes;
