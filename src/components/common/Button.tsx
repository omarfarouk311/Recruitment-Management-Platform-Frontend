import React from "react";
import { Loader } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "outline" | "currentTab" | "report";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className = "", loading, variant = "primary", ...props },
    ref
  ) => {
    const baseStyles =
      "w-full px-6 py-2 rounded-full font-medium transition-all duration-200 ease-in-out flex items-center justify-center border-2 border-black";

    const variants = {
      primary:
        "bg-black text-white hover:bg-transparent hover:text-black hover:border-black",
      outline: "text-black hover:bg-black hover:text-white",
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
          ${loading ? "opacity-70 cursor-not-allowed" : ""}
          ${className}
        `}
        disabled={loading}
        {...props}
      >
        {loading ? <Loader className="w-5 h-5 animate-spin" /> : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
