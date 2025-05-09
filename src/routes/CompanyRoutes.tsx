import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import CompanyDashboard from "../pages/CompanyDashboard";
import { Assessment } from "../components/Assessment/Assessment";
import CompanyProfile from "../pages/CompanyProfile";
import JobSeekerProfile from "../pages/JobSeekerProfile";
import RecruiterProfile from "../pages/RecruiterProfile";

function CompanyRoutes() {
  return (
    <Routes>
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/dashboard" element={<CompanyDashboard />} />
      <Route path="/profile" element={<CompanyProfile />} />
      <Route path="/seekers/:id" element={<JobSeekerProfile />} />
      <Route path="/recruiters/:id" element={<RecruiterProfile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default CompanyRoutes;
