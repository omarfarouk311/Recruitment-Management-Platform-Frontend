import React, { useEffect, useState } from "react";
import Button from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import useStore from "../stores/globalStore";
import background from "../assets/gradient-background.png";
import { UserRole } from "../stores/User Slices/userSlice";
import axios from "axios";
import config from "../../config/config";
import { Loader2 } from "lucide-react";

async function refreshToken() {
  try {
    await axios.post(`${config.API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
    return true;
  } catch (err) {
    return false;
  }
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const userRole = useStore.useUserRole();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/auth/check-auth`, { withCredentials: true });

      if (!res.data.isProfileFinished) {
        if (userRole === UserRole.SEEKER) {
          navigate("/seeker/finish-profile", { replace: true });
        } else if (userRole === UserRole.COMPANY) {
          navigate("/company/finish-profile", { replace: true });
        } else if (userRole === UserRole.RECRUITER) {
          navigate("/recruiter/finish-profile", { replace: true });
        }
      } else {
        if (userRole === UserRole.SEEKER) {
          navigate("/seeker/home", { replace: true });
        } else if (userRole === UserRole.COMPANY) {
          navigate("/company/dashboard", { replace: true });
        } else if (userRole === UserRole.RECRUITER) {
          navigate("/recruiter/dashboard", { replace: true });
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          const succeeded = await refreshToken();
          if (succeeded) await checkAuth();
        }
      }
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${background})`, backgroundSize: "cover" }}
      >
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  return (
    <div
      className="mx-auto px-8 min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="flex flex-col items-center flex-1 justify-center">
        <h1 className="text-4xl font-bold text-center text-black mb-8 mx-auto">
          An All-In-One platform that simplifies the recruitment process
        </h1>

        <h2 className="text-2xl text-center text-black mb-12 mx-auto font-semibold">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            role="button"
            className="underline underline-offset-8 hover:text-blue-700 cursor-pointer transition-colors"
          >
            Login
          </span>
        </h2>

        <div className="flex flex-wrap justify-center gap-8 mb-12 w-full">
          {/* Seeker Card */}
          <div className="flex-1 min-w-[300px] max-w-[400px] p-8 bg-white/50 rounded-xl shadow-md border border-gray-200 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-black">Job Seeker</h2>
            <p className="text-black mb-6 font-semibold leading-relaxed">
              Track your recruitment journey with ease, from CV submission to job offer.
            </p>
            <Button
              onClick={() => {
                navigate(`/signup?role=${UserRole.SEEKER}`);
              }}
              className="rounded-lg py-3"
            >
              Join as a job seeker
            </Button>
          </div>

          {/* Recruiter Card */}
          <div className="flex-1 min-w-[300px] max-w-[400px] p-8 bg-white/50 rounded-xl shadow-md border border-gray-200 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-black">Recruiter</h2>
            <p className="text-black mb-6 font-semibold leading-relaxed">
              Reduce administrative burden and focus on finding the best talent.
            </p>
            <Button
              onClick={() => {
                navigate(`/signup?role=${UserRole.RECRUITER}`);
              }}
              className="rounded-lg py-3"
            >
              Join as a recruiter
            </Button>
          </div>

          {/* Company Card */}
          <div className="flex-1 min-w-[300px] max-w-[400px] p-8 bg-white/50 rounded-xl shadow-md border border-gray-200 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-black">Company</h2>
            <p className="text-black mb-6 font-semibold leading-relaxed">
              Efficiently manage your recruitment process from start to finish.
            </p>
            <Button
              onClick={() => {
                navigate(`/signup?role=${UserRole.COMPANY}`);
              }}
              className="rounded-lg py-3"
            >
              Join as a company
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
