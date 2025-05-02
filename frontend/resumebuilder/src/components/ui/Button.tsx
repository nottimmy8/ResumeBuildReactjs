import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  icon?: React.ReactNode; // Accepts an icon component
  iconPosition?: "left" | "right"; // Controls icon placement
  type?: "" | "button" | "submit" | "reset";
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
  rounded = "md",
}) => {
  const baseStyles =
    " w- flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring";

  const variantStyles = {
    primary: "bg-black text-white ",
    secondary:
      "bg-purple-100  font-semibold text-black px-3 py-2.5 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer   ",
  };

  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2  text-sm",
    lg: "px-6 py-3  text-sm",
  };

  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles[rounded],
        // disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
