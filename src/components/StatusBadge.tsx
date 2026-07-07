import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface StatusBadgeProps {
  status: string;
  style?: ViewStyle | ViewStyle[];
}

export default function StatusBadge({ status, style }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  // Variables para definir los colores según el estado
  let textColor = "#6B7280"; // Gris por defecto
  let bgColor = "#F3F4F6"; // Fondo gris clarito por defecto

  switch (normalizedStatus) {
    case "abierto":
    case "aceptada":
      textColor = "#16A34A"; // Verde
      bgColor = "#DCFCE7"; // Fondo verde claro
      break;
    case "pendiente":
      textColor = "#B45309"; // Naranja
      bgColor = "#FEF3C7"; // Fondo naranja claro
      break;
    case "cerrado":
    case "rechazada":
    case "caducada":
      textColor = "#6B7280"; // Gris oscuro
      bgColor = "#F3F4F6"; // Fondo gris claro
      break;
  }

  // Capitalizamos la primera letra (ej: "abierto" -> "Abierto")
  const formattedStatus =
    normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);

  return (
    <View style={[styles.badgeContainer, { backgroundColor: bgColor }, style]}>
      <Text style={[styles.badgeText, { color: textColor }]}>
        {formattedStatus}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
