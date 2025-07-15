import React from "react";
import { Text, View } from "react-native";

export default function Logo() {
  return (
    <View className="relative h-[153px] w-full items-center justify-center">
      {/* Titre Pick Me */}
      <Text
        className="text-primary-text text-center text-[48px] font-bold"
        style={{ fontFamily: "ClimateCrisis-Regular" }}
      >
        PicMe
      </Text>
    </View>
  );
}
