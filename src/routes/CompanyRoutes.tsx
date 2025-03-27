import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { Assessment } from "../components/Assessment/Assessment";


function CompanyRoutes() {
    return (
        <Routes>
            <Route path="/assessment" element={<Assessment />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default CompanyRoutes;