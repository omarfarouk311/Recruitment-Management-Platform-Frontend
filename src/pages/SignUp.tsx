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
// import googleLogo from "../assets/google-logo.png";
// import facebookLogo from "../assets/facebook-logo.png";

const signUpSchema = z
    .object({
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
    const navigate = useNavigate();
    const userRole = useStore.useUserRole();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpFormData) => {
        try {
            await axios.post(`${config.API_BASE_URL}/auth/signup`, {
                email: data.email,
                password: data.password,
                confirmationPassword: data.confirmPassword,
                role: userRole,
            });
            navigate("/login", { replace: true });
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                    const validationErrors: string[] = err.response?.data.validationErrors;
                    validationErrors.forEach((validationError) => {
                        showErrorToast(validationError);
                    });
                } else if (err.response?.status === 409) {
                    showErrorToast(err.response?.data.message);
                } else {
                    showErrorToast("Failed to create account. Please try again.");
                }
            }
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
                    Login
                </span>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <Input
                    label="What's your email?"
                    placeholder="Enter your email address"
                    error={errors.email?.message}
                    {...register("email")}
                />

                <Input
                    label="Create a password"
                    type="password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    {...register("password")}
                />

                <Input
                    label="Confirm your password"
                    type="password"
                    placeholder="Enter your confirm password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                />

                <p className="text-sm text-gray-500">
                    Use 8 or more characters with a mix of letters, numbers & symbols
                </p>

                <Button type="submit" loading={isSubmitting} className="!h-10">
                    Create an account
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
                        <img src={googleLogo} alt="Google logo" className="w-6 h-6" />
                        Google
                    </Button>
                    <Button variant="outline" type="button" className="flex items-center gap-2">
                        <img src={facebookLogo} alt="Facebook logo" className="w-8 h-8" />
                        Facebook
                    </Button>
                </div> */}
            </form>
        </AuthLayout>
    );
};

export default SignUp;
