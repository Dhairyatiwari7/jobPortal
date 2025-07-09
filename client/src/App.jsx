import "./index.css";
import { Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import Dashboard from "./pages/Dashboard";
import RecruiterLogin from "./components/RecruiterLogin";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";

function App() {
  const { showRecruiterLogin, companyToken } = useContext(AppContext);
  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/dashboard" element={<Dashboard />}>
        {companyToken ? <>
          <Route path="/dashboard/add-job" element={<AddJob />} />
          <Route path="/dashboard/manage-jobs" element={<ManageJobs />} />
          <Route
            path="/dashboard/view-applications"
            element={<ViewApplications />}
          />
          </>:null
        }
        </Route>
      </Routes>
    </div>
  );
}

export default App;
