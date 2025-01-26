import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  link?: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  link,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-400 via-purple-500 to-orange-500 pt-8 relative">
      <div className="w-full max-w-md px-4 absolute top-2 left-0">
        <h1 className="text-white text-4xl font-bold">
          Your next job is here...
        </h1>
      </div>

      {/* Main Content Card */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 mx-4 min-w-[450px]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black">{title}</h2>
            {subtitle && (
              <p className="text-center text-sm text-gray-600">
                {subtitle}
                {link && <> {link}</>}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
