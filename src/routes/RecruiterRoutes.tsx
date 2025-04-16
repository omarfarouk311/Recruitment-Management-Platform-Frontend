import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/RecruiterDashboard";
import JobSeekerProfile from "../pages/JobSeekerProfile";
import Profile from '../pages/RecruiterProfile';

function RecruiterRoutes() {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/seeker-profile" element={<JobSeekerProfile />} />
        </Routes>
    );
}

export default RecruiterRoutes;
