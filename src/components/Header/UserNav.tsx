import { User, Home, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface UserNavProps {
  children?: ReactNode;
}

const UserNav = ({ children }: UserNavProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex items-center px-6 py-4 h-20 bg-white shadow-sm border-b-2 border-gray-300 relative">
      {/* Left Section (Profile and Dashboard Buttons) */}
      <div className="flex items-center space-x-4 absolute left-12">
        {/* Profile Button */}
        {currentPath === "/profile" ? (
          <span
            className="px-3 py-2 hover:bg-gray-200 rounded-full transition-colors"
            role="button"
          >
            <User className="w-6 h-6" />
            <span className="font-medium">User 1</span>
          </span>
        ) : (
          <Link
            to="/profile"
            className="flex items-center space-x-2 hover:bg-gray-200 rounded-full px-3 py-2 transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="font-medium">User 1</span>
          </Link>
        )}

        {/* Dashboard Button */}
        {currentPath === "/dashboard" ? (
          <span
            className="px-3 py-2 hover:bg-gray-200 rounded-full transition-colors"
            role="button"
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="font-medium">Dashboard</span>
          </span>
        ) : (
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 hover:bg-gray-200 rounded-full px-3 py-2 transition-colors"
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="font-medium">Dashboard</span>
          </Link>
        )}
      </div>

      {/* Centered Search Bar */}
      {children && (
        <div className="flex justify-center flex-grow">{children}</div>
      )}

      {/* Right Section (Home Button) */}
      <div className="flex absolute right-12">
        {currentPath === "/seeker/home" ? (
          <span
            className="p-3 hover:bg-gray-200 rounded-full transition-colors"
            role="button"
          >
            <Home className="w-6 h-6" />
          </span>
        ) : (
          <Link
            to="/seeker/home"
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Home className="w-12 h-6" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserNav;
