import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  iconName?: keyof typeof Ionicons.glyphMap; // Ahora es opcional
  variant?: "default" | "expired"; // Agregamos la variante
  style?: StyleProp<ViewStyle>;
}

export default function EmptyState({
  title,
  subtitle,
  iconName,
  variant = "default",
  style,
}: EmptyStateProps) {
  const isExpired = variant === "expired";

  return (
    <View
      style={[
        styles.baseCard,
        isExpired ? styles.expiredCard : styles.defaultCard,
        style,
      ]}
    >
      {/* Solo renderizamos el ícono si se le pasa la propiedad iconName */}
      {iconName && (
        <Ionicons
          name={iconName}
          size={48}
          color={isExpired ? "#999" : "#D1D5DB"}
          style={{ marginBottom: 16 }}
        />
      )}

      <Text style={[styles.baseTitle, isExpired && styles.expiredTitle]}>
        {title}
      </Text>

      {subtitle && (
        <Text style={[styles.baseSub, isExpired && styles.expiredSub]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Estilos compartidos por ambas variantes
  baseCard: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  baseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  baseSub: {
    fontSize: 14,
    textAlign: "center",
  },

  // Variaciones para el estado por defecto
  defaultCard: {
    backgroundColor: "#fff",
    borderColor: "#E5E5E5",
  },

  // Variaciones para el estado CADUCADO
  expiredCard: {
    backgroundColor: "#FAFAFA",
    borderColor: "#EAEAEA",
  },
  expiredTitle: {
    color: "#999",
  },
  expiredSub: {
    color: "#999",
  },
});
