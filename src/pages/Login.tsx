import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthLayout from "../components/common/AuthLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import axios from "axios";
import config from "../../config/config";
import useStore from "../stores/globalStore";
import { showErrorToast } from "../util/errorHandler";
import { UserRole } from "../stores/User Slices/userSlice";
// import googleLogo from "../assets/google-logo.png";
// import facebookLogo from "../assets/facebook-logo.png";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
    const navigate = useNavigate();
    const setUserId = useStore.useUserSetId();
    const setRole = useStore.useUserSetRole();
    const setName = useStore.useUserSetName();
    const setImage = useStore.useUserSetImage();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const res = await axios.post(
                `${config.API_BASE_URL}/auth/login`,
                { email: data.email, password: data.password },
                { withCredentials: true }
            );

            const { userId, userRole } = res.data;

            // Update global state with user data
            setUserId(userId);
            setRole(userRole);

            // If the user has not completed their profile, redirect to finish profile page
            if (res.data.name === null) {
                if (userRole === UserRole.SEEKER) {
                    navigate("/seeker/finish-profile", { replace: true });
                } else if (userRole === UserRole.COMPANY) {
                    navigate("/company/finish-profile", { replace: true });
                } else if (userRole === UserRole.RECRUITER) {
                    navigate("/recruiter/finish-profile", { replace: true });
                }
            }
            // the user has completed their profile
            else {
                setName(res.data.name);
                if (userRole === UserRole.SEEKER) {
                    setImage(`${config.API_BASE_URL}/seekers/profiles/${userId}/image?t=${Date.now()}`);
                    navigate("/seeker/home", { replace: true });
                } else if (userRole === UserRole.COMPANY) {
                    setImage(`${config.API_BASE_URL}/companies/${userId}/image?t=${Date.now()}`);
                    navigate("/company/dashboard", { replace: true });
                } else if (userRole === UserRole.RECRUITER) {
                    setImage(`${config.API_BASE_URL}/recruiters/${userId}/profile-pic?t=${Date.now()}`);
                    navigate("/recruiter/dashboard", { replace: true });
                }
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    showErrorToast("Invalid email or password");
                } else if (error.response?.status === 400) {
                    const validationErrors: string[] = error.response?.data.validationErrors;
                    validationErrors.forEach((validationError) => {
                        showErrorToast(validationError);
                    });
                } else {
                    showErrorToast("Login failed. Please try again.");
                }
            }
        }
    };

    return (
        <AuthLayout
            title="Welcome back!"
            subtitle="New to the platform?"
            link={
                <span
                    onClick={() => navigate("/signup")}
                    role="button"
                    className="text-purple-600 underline underline-offset-4 hover:text-purple-400 cursor-pointer transition-colors"
                >
                    Create an account
                </span>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                <Input
                    label="Email address"
                    type="email"
                    placeholder="Enter your email address"
                    error={errors.email?.message}
                    {...register("email")}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    {...register("password")}
                />

                {/* <div className="flex items-center justify-end">
                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-sm text-purple-600 hover:text-purple-400"
                    >
                        Forgot password?
                    </button>
                </div> */}

                <Button type="submit" loading={isSubmitting} className="!h-10">
                    Login
                </Button>

                {/* <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR Continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" type="button" className="flex items-center gap-2">
                        <img src={googleLogo} alt="Google logo" className="w-5 h-5" />
                        Google
                    </Button>
                    <Button variant="outline" type="button" className="flex items-center gap-2">
                        <img src={facebookLogo} alt="Facebook logo" className="w-7 h-7" />
                        Facebook
                    </Button>
                </div> */}
            </form>
        </AuthLayout>
    );
};

export default Login;
