import { Routes, Route } from "react-router-dom";
import InvitationsDashboard from "../components/Recruiter Dashboard/RecruiterInvitations";
import Dashboard from "../pages/RecruiterDashboard";
import Profile from '../pages/RecruiterProfile';


function RecruiterRoutes() {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invitations" element={<InvitationsDashboard />} />
            <Route path="/interviews" element={<InvitationsDashboard />} />
            <Route path="/profile" element={<Profile />} />

        </Routes>
    );
}

export default RecruiterRoutes;