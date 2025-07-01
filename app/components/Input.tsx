import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  return (
    <View className="mb-sm">
      {label && (
        <Text className="text-text-primary text-base mb-xs font-medium">
          {label}
        </Text>
      )}

      <View className="relative">
        <TextInput
          className={`h-input px-md border border-border-primary rounded-md text-base bg-background-tertiary text-text-primary ${
            error
              ? "border-danger"
              : "border-border-primary focus:border-border-focus"
          } ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""} ${className}`}
          placeholderTextColor="#636366"
          {...props}
        />

        {leftIcon && (
          <View className="absolute left-3 top-1/2 -translate-y-1/2">
            {leftIcon}
          </View>
        )}

        {rightIcon && (
          <View className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightIcon}
          </View>
        )}
      </View>

      {error && <Text className="text-danger text-sm mt-xs">{error}</Text>}
    </View>
  );
};
