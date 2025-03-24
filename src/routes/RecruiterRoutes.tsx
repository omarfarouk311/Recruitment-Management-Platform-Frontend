import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/RecruiterDashboard";
import Profile from '../pages/RecruiterProfile';


function RecruiterRoutes() {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

        </Routes>
    );
}

export default RecruiterRoutes;