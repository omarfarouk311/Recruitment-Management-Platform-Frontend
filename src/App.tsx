import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import SeekerRoutes from "./routes/SeekerRoutes";
import RecruiterRoutes from "./routes/RecruiterRoutes";
import useStore from "./stores/globalStore";
import CompanyRoutes from "./routes/CompanyRoutes";
import { ToastContainer } from "react-toastify";
import { UserRole } from "./stores/User Slices/userSlice";

function App() {
  // for testing different user types. Will be removed after completing
  const setName = useStore.useUserSetName();
  const setRole = useStore.useUserSetRole();
  const setUserId = useStore.useUserSetId();
  // change according to the type you need to test
  setRole(UserRole.COMPANY);
  setName("John Doe");
  setUserId(1);
  ///////////////////////

  const userRole = useStore.useUserRole();

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {userRole === UserRole.SEEKER && (
            <Route path="/seeker/*" element={<SeekerRoutes />} />
          )}

          {userRole === UserRole.RECRUITER && (
            <Route path="/recruiter/*" element={<RecruiterRoutes />} />
          )}

          {/* To be added after creating company routes */}
          {userRole === UserRole.COMPANY && (
            <Route path="/company/*" element={<CompanyRoutes />} />
          )}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
