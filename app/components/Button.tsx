import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  disabled = false,
  className = "",
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = "h-button justify-center items-center rounded-md px-md";

    switch (variant) {
      case "primary":
        return `${baseStyle} bg-primary ${disabled ? "opacity-50" : ""}`;
      case "secondary":
        return `${baseStyle} bg-background-tertiary ${disabled ? "opacity-50" : ""}`;
      case "outline":
        return `${baseStyle} border-2 border-primary bg-transparent ${disabled ? "opacity-50" : ""}`;
      default:
        return `${baseStyle} bg-primary ${disabled ? "opacity-50" : ""}`;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return "text-black text-base font-medium";
      case "secondary":
        return "text-text-primary text-base font-medium";
      case "outline":
        return "text-primary text-base font-medium";
      default:
        return "text-black text-base font-medium";
    }
  };

  return (
    <TouchableOpacity
      className={`${getButtonStyle()} ${className}`}
      disabled={disabled}
      {...props}
    >
      <Text className={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};
