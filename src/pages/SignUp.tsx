import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/common/AuthLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import googleLogo from "../assets/google-logo.png";
import facebookLogo from "../assets/facebook-logo.png";
import axios from "axios";
import config from "../../config/config";
import useStore from "../stores/globalStore";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const userRole=useStore.useUserRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {

      const res = await axios.post(`${config.API_BASE_URL}/auth/signup`, {
        email,
        password,
        confirmationPassword:confirmPassword,
        role:userRole
      }); 
      if(userRole===2){
        navigate("/recruiter/profile");
      }
      else if(userRole===0){
        navigate("/seeker/profile");
      }
      else{
        navigate("/company/profile");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="What's your email?"
          type="email"
          placeholder="Enter your email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Create a password"
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirm your password"
          type="password"
          placeholder="Enter your confirm password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
