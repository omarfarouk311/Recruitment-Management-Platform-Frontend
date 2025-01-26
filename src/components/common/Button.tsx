import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "outline";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className = "", loading, variant = "primary", ...props },
    ref
  ) => {
    const baseStyles =
      "w-full px-6 py-2 rounded-full font-medium transition-all duration-200 ease-in-out flex items-center justify-center border-2";

    const variants = {
      primary:
        "bg-black text-white hover:bg-transparent hover:text-black hover:border-black",
      outline:
        "border-2 border-black text-black hover:bg-black hover:text-white",
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
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
