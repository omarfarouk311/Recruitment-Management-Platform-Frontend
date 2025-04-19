import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/RecruiterDashboard";
import JobSeekerProfile from "../pages/JobSeekerProfile";
import Profile from '../pages/RecruiterProfile';
import CompanyProfile from "../pages/CompanyProfile";

function RecruiterRoutes() {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/seeker-profile" element={<JobSeekerProfile />} />
            <Route path="/company-profile" element={<CompanyProfile />} />
        </Routes>
    );
}

export default RecruiterRoutes;
