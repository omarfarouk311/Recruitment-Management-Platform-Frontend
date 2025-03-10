import { Routes, Route } from "react-router-dom";
import JobSeekerHome from "../pages/JobSeekerHome";
import ProfileSetup from "../pages/ProfileSetup";
import SeekerDashboard from "../pages/SeekerDashboard";
import NotFound from "../pages/NotFound";

function SeekerRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<JobSeekerHome />} />
      <Route path="/finish-profile" element={<ProfileSetup />} />
      <Route path="/dashboard" element={<SeekerDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default SeekerRoutes;
