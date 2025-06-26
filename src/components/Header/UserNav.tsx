import { Home, LayoutDashboard, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { ReactNode } from "react";
import useStore from "../../stores/globalStore";
import { UserRole } from "../../stores/User Slices/userSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../config/config";
import { authRefreshToken } from "../../util/authUtils";
import { showErrorToast } from "../../util/errorHandler";

async function logout() {
    try {
        await axios.post(`${config.API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                const success = await authRefreshToken();
                if (success) await logout();
            } else {
                showErrorToast("Logout failed");
            }
        }
    }
}

interface UserNavProps {
    children?: ReactNode;
}

const UserNav = ({ children }: UserNavProps) => {
    const userRole = useStore.useUserRole();
    const userImage = useStore.useUserImage();
    const userName = useStore.useUserName();
    const urlRole =
        userRole === UserRole.SEEKER ? "seeker" : userRole === UserRole.RECRUITER ? "recruiter" : "company";

    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [userImage]);

    return (
        <div className="flex items-center px-6 py-4 h-20 bg-white shadow-sm border-b-2 border-gray-300">
            {/* Left Section: Home and Dashboard */}
            <div className="flex items-center space-x-4 flex-1">
                {userRole === UserRole.SEEKER && (
                    <Link
                        to={`/${urlRole}/home`}
                        className="flex items-center space-x-2 hover:bg-gray-200 rounded-full px-3 py-2 transition-colors"
                    >
                        <Home className="w-6 h-6" />
                    </Link>
                )}

                <Link
                    to={`/${urlRole}/dashboard`}
                    className="flex items-center space-x-2 hover:bg-gray-200 rounded-full px-3 py-2 transition-colors"
                >
                    <LayoutDashboard className="w-6 h-6" />
                    <span className="font-medium">Dashboard</span>
                </Link>
            </div>

            {/* Center Section: Children (e.g. Search Bar) */}
            <div className="flex justify-center flex-grow">{children}</div>

            {/* Right Section: Profile and Logout */}
            <div className="flex items-center gap-4 flex-1 justify-end">
                <Link
                    to={`/${urlRole}/profile`}
                    className="flex items-center space-x-2 hover:bg-gray-200 rounded-full px-3 py-2 transition-colors"
                >
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {!imageError && userImage ? (
                            <img
                                src={userImage}
                                onError={() => setImageError(true)}
                                className="h-10 w-10 rounded-full object-cover"
                                alt="Profile"
                            />
                        ) : (
                            <span className="h-10 w-10 text-lg text-gray-400 flex items-center justify-center">
                                {userName?.charAt(0)}
                            </span>
                        )}
                    </div>
                    <span className="font-medium">{userName}</span>
                </Link>

                <button
                    onClick={logout}
                    className="flex items-center space-x-2 hover:bg-gray-200 rounded-full px-3 py-2 transition-colors"
                >
                    <LogOut className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default UserNav;
