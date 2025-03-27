import React from "react";
import { Loader } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "outline" | "currentTab" | "report";
  disabled?: boolean;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      loading,
      variant = "primary",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "whitespace-nowrap w-full px-6 py-2 rounded-full font-medium transition-all duration-200 ease-in-out flex items-center justify-center border-2 border-black box-border hover:cursor-pointer";

    const variants = {
      primary:
        "bg-black text-white hover:bg-transparent hover:text-black hover:border-black",
      outline:
        "text-black hover:bg-black hover:text-white disabled:bg-gray-100 disabled:border-gray-400 disabled:text-gray-400",
      currentTab: "bg-black text-white",
      report:
        "border-red-600 bg-red-600 text-white hover:bg-transparent hover:text-red-600 hover:border-red-600",
    };

    return (
      <button
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${loading ? "opacity-70" : ""}
          ${className}
        `}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? <Loader className="w-5 h-5 animate-spin" /> : children}
      </button>
    );
  }
);

export default Button;
