import React from "react";
import {
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void; // Si le pasamos esto, la tarjeta será clickeable
}

export default function Card({ children, style, onPress }: CardProps) {
  // Si la tarjeta tiene una acción, usamos TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={onPress}
        activeOpacity={0.7} // Efecto visual al tocar
      >
        {children}
      </TouchableOpacity>
    );
  }

  // Si no, es solo un contenedor View normal
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 16,
    // elevation: 1,
  },
});
