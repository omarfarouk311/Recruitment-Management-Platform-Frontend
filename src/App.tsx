import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import SeekerRoutes from "./routes/SeekerRoutes";
import RecruiterRoutes from "./routes/RecruiterRoutes";
import useStore from "./stores/globalStore";

function App() {
  // for testing different user types. Will be removed after completing
  const setName = useStore.useUserSetName();
  const setRole = useStore.useUserSetRole();
  // change according to the type you need to test
  setRole("recruiter");
  setName("John Doe");
  ///////////////////////

  const userRole = useStore.useUserRole();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {userRole === "seeker" && (
          <Route path="/seeker/*" element={<SeekerRoutes />} />
        )}

        {userRole === "recruiter" && (
          <Route path="/recruiter/*" element={<RecruiterRoutes />} />
        )}

        {/* To be added after creating company routes */}
        {/* {userRole === "company" && (
          <Route path="/company/*" element={<CompanyRoutes />} />
        )} */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
