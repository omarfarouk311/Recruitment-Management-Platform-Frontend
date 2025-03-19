import { Home, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { ReactNode } from "react";
import useStore from "../../stores/globalStore";

interface UserNavProps {
  children?: ReactNode;
}

const UserNav = ({ children }: UserNavProps) => {
  const userRole = useStore.useUserRole();
  const userImage = useStore.useUserImage();
  const userName = useStore.useUserName();

  return (
    <div className="flex items-center px-6 py-4 h-20 bg-white shadow-sm border-b-2 border-gray-300 relative">
      {/* Left Section (Profile and Dashboard Buttons) */}
      <div className="flex items-center space-x-4 absolute left-10">
        {/* Profile Button */}
        <div className="flex items-center space-x-1 p-2">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
            {userImage ? (
              <img
                src={userImage}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <span className="h-12 w-12 text-2xl text-gray-400 flex items-center justify-center">
                {userName?.charAt(0)}
              </span>
            )}
          </div>

          <Link to={`/${userRole}/profile`}>
            <span
              className="font-medium hover:bg-gray-200 transition-colors rounded-full px-4 py-1"
              role="button"
            >
              {userName}
            </span>
          </Link>
        </div>

        {/* Dashboard Button */}
        <Link
          to={`/${userRole}/dashboard`}
          className="flex items-center space-x-2 hover:bg-gray-200 rounded-full px-3 py-2 transition-colors"
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="font-medium">Dashboard</span>
        </Link>
      </div>

      {/* Centered Search Bar */}
      {children && (
        <div className="flex justify-center flex-grow">{children}</div>
      )}

      {/* Right Section (Home Button) */}
      <div className="flex absolute right-10">
        <Link
          to={`/${userRole}/home`}
          className="flex items-center space-x-2 hover:bg-gray-200 rounded-full px-3 py-2 transition-colors"
        >
          <Home className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default UserNav;
