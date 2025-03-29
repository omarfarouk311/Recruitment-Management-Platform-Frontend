import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import CompanyDashboard from "../pages/CompanyDashboard";
import { Assessment } from "../components/Assessment/Assessment";


function CompanyRoutes() {
    return (
        <Routes>
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/dashboard" element={<CompanyDashboard />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default CompanyRoutes;