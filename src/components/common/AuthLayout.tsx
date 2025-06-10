import React, { ReactNode } from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    link?: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, link }) => {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-400 via-purple-500 to-orange-500">
            <div className="w-full max-w-md px-4 absolute top-2 left-0">
                <h1 className="text-white text-3xl font-bold">Your next job is here...</h1>
            </div>

            <div className="flex-1 flex items-center justify-center">
                <div className="min-w-[450px] bg-white rounded-2xl shadow border-2 border-gray-200 p-8">
                    <div className="text-center mb-12">
                        <h1 className="text-2xl font-bold text-black mb-1">{title}</h1>
                        {subtitle && (
                            <p className="text-center text-md text-gray-600">
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
