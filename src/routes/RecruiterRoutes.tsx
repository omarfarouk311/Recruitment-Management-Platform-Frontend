import { Routes, Route } from "react-router-dom";
import InvitationsDashboard from "../components/Recruiter Dashboard/RecruiterInvitations";
import Dashboard from "../pages/RecruiterDashboard";


function RecruiterRoutes() {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/invitations" element={<InvitationsDashboard />} />
        </Routes>
    );
}

export default RecruiterRoutes;