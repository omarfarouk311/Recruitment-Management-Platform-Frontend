import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : type}
            className={`
              w-full px-4 py-2 rounded-full bg-gray-50 border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
              transition-all duration-200 ease-in-out
              ${error ? "border-red-500" : ""}
              ${className}
            `}
            {...props}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
