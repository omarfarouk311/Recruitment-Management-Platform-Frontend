import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/common/AuthLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import googleLogo from "../assets/google-logo.png";
import facebookLogo from "../assets/facebook-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add login logic here
    setTimeout(() => {
      setLoading(false);
      navigate("/home");
    }, 1500);
  };

  return (
    <AuthLayout
      title="Log in"
      subtitle="New to the platform?"
      link={
        <span
          onClick={() => navigate("/signup")}
          role="button"
          className="text-purple-600 underline underline-offset-4 hover:text-purple-400 cursor-pointer transition-colors"
        >
          Sign up
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email address"
          type="email"
          placeholder="Enter your email address"
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
        />

        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-purple-600 hover:text-purple-400"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading}>
          Log in
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              OR Continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            type="button"
            className="flex items-center gap-2"
          >
            <img src={googleLogo} alt="Google logo" className="w-5 h-5" />
            Google
          </Button>
          <Button
            variant="outline"
            type="button"
            className="flex items-center gap-2"
          >
            <img src={facebookLogo} alt="Facebook logo" className="w-7 h-7" />
            Facebook
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
