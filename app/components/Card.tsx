import React from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from "react-native";

// 🎴 Carte de base
interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <View
      className={`bg-background-secondary rounded-lg p-md border border-border-primary ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};

// 👆 Carte cliquable
interface TouchableCardProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

export const TouchableCard: React.FC<TouchableCardProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <TouchableOpacity
      className={`bg-background-secondary rounded-lg p-md border border-border-primary ${className}`}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

// 📋 Item de liste
interface ListItemProps extends TouchableOpacityProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showChevron?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  showChevron = false,
  className = "",
  ...props
}) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center p-md border-b border-border-primary ${className}`}
      {...props}
    >
      {leftIcon && <View className="mr-md">{leftIcon}</View>}

      <View className="flex-1">
        <Text className="text-text-primary text-base font-medium">{title}</Text>
        {subtitle && (
          <Text className="text-text-secondary text-sm mt-xs">{subtitle}</Text>
        )}
      </View>

      {rightIcon && <View className="ml-md">{rightIcon}</View>}

      {showChevron && <Text className="text-text-muted ml-md">›</Text>}
    </TouchableOpacity>
  );
};

// 📦 Section avec titre
interface SectionProps extends ViewProps {
  title?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = "",
  ...props
}) => {
  return (
    <View className={`mb-lg ${className}`} {...props}>
      {title && (
        <Text className="text-text-primary text-lg font-semibold mb-md">
          {title}
        </Text>
      )}
      {children}
    </View>
  );
};
