import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import LandingPage from "./pages/LandingPage";
import JobSeekerHome from "./pages/JobSeekerHome";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/finish-profile" element={<ProfileSetup />} />
        <Route path="/home" element={<JobSeekerHome />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
