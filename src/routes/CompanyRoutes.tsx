import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import CompanyDashboard from "../pages/CompanyDashboard";
import { Assessment } from "../components/Assessment/Assessment";
import CompanyProfile from "../pages/CompanyProfile";
import JobSeekerProfile from "../pages/JobSeekerProfile";
import RecruiterProfile from "../pages/RecruiterProfile";
import CompanyFinishProfile from "../pages/CompanyFinishProfile";

function CompanyRoutes() {
  return (
    <Routes>
      <Route path="/assessment/:assessmentId" element={<Assessment />} />
      <Route path="/dashboard" element={<CompanyDashboard />} />
      <Route path="/profile" element={<CompanyProfile />} />
      <Route path="/seeker/:userId/job/:jobId" element={<JobSeekerProfile />} />
      <Route path="/recruiters/:id" element={<RecruiterProfile />} />
      <Route path="/:id" element={<CompanyProfile />} />
      <Route path="/finish-profile" element={<CompanyFinishProfile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default CompanyRoutes;
