import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/RecruiterDashboard";




function RecruiterRoutes() {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}

export default RecruiterRoutes;