import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/RecruiterDashboard";
import JobSeekerProfile from "../pages/JobSeekerProfile";
import Profile from "../pages/RecruiterProfile";
import CompanyProfile from "../pages/CompanyProfile";
import RecruiterFinishProfile from "../pages/RecruiterFinishProfile";
import NotFound from "../pages/NotFound";

function RecruiterRoutes() {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/seekers/:userId/job/:jobId" element={<JobSeekerProfile />} />
            <Route path="/companies/:id" element={<CompanyProfile />} />
            <Route path="/finish-profile" element={<RecruiterFinishProfile />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default RecruiterRoutes;
