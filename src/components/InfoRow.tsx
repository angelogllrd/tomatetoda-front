import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string | number;
  iconSize?: number;
  iconColor?: string;
  textColor?: string;
  style?: ViewStyle | ViewStyle[];
  textSize?: number;
}

export default function InfoRow({
  icon,
  text,
  iconSize = 16, // Un tamaño un poco más legible
  iconColor = "#888", // Gris medio por defecto
  textColor = "#666", // Gris oscuro para el texto
  style,
  textSize = 14,
}: InfoRowProps) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name={icon} size={iconSize} color={iconColor} />
      <Text style={[styles.text, { color: textColor, fontSize: textSize }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8, // Separación vertical estándar entre filas
  },
  text: {
    fontSize: 14,
    marginLeft: 6, // Separación horizontal exacta entre ícono y texto
    flexShrink: 1, // Evita que el texto empuje el ícono fuera de la pantalla si es muy largo
  },
});
