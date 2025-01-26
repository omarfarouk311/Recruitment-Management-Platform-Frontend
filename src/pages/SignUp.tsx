import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/common/AuthLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import googleLogo from "../assets/google-logo.png";
import facebookLogo from "../assets/facebook-logo.png";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add signup logic here
    setTimeout(() => {
      setLoading(false);
      navigate("/finish-profile");
    }, 1500);
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Already have an account?"
      link={
        <span
          onClick={() => navigate("/login")}
          role="button"
          className="text-purple-600 underline underline-offset-4 hover:text-purple-400 cursor-pointer transition-colors"
        >
          Log in
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="What should we call you?"
          placeholder="Enter your profile name"
          required
        />
        <Input
          label="What's your email?"
          type="email"
          placeholder="Enter your email address"
          required
        />
        <Input
          label="Create a password"
          type="password"
          placeholder="Enter your password"
          required
        />
        <p className="text-sm text-gray-500">
          Use 8 or more characters with a mix of letters, numbers & symbols
        </p>

        <Button type="submit" loading={loading}>
          Create an account
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
            <img src={googleLogo} alt="Google logo" className="w-6 h-6" />
            Google
          </Button>
          <Button
            variant="outline"
            type="button"
            className="flex items-center gap-2"
          >
            <img src={facebookLogo} alt="Facebook logo" className="w-8 h-8" />
            Facebook
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
