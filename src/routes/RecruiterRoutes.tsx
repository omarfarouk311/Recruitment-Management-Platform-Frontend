import { Routes, Route } from "react-router-dom";
import InvitationsDashboard from "../components/Recruiter Dashboard/RecruiterInvitations";
import Dashboard from "../pages/RecruiterDashboard";
import JobSeekerProfile from "../pages/JobSeekerProfile";

function RecruiterRoutes() {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invitations" element={<InvitationsDashboard />} />
            <Route path="/interviews" element={<InvitationsDashboard />} />
            <Route path="/seeker-profile" element={<JobSeekerProfile />} />
        </Routes>
    );
}

export default RecruiterRoutes;
