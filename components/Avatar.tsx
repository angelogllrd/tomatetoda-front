import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface AvatarProps {
  name: string; // Recibe el nombre completo, el componente extrae la inicial
  size?: "md" | "lg"; // md = Home (48px), lg = Perfiles (64px)
  style?: StyleProp<ViewStyle>; // Para pasar márgenes extra si es necesario
}

export default function Avatar({ name, size = "md", style }: AvatarProps) {
  // Extraemos la primera letra. Si por algún motivo no hay nombre, mostramos un "?"
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  // Elegimos los estilos dinámicamente según el tamaño
  const containerSizeStyle =
    size === "lg" ? styles.largeContainer : styles.mediumContainer;
  const textSizeStyle = size === "lg" ? styles.largeText : styles.mediumText;

  return (
    <View style={[styles.baseContainer, containerSizeStyle, style]}>
      <Text style={[styles.baseText, textSizeStyle]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Estilos base compartidos
  baseContainer: {
    backgroundColor: "#E8321E",
    justifyContent: "center",
    alignItems: "center",
  },
  baseText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // Tamaño Mediano (Home)
  mediumContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  mediumText: {
    fontSize: 20,
  },

  // Tamaño Grande (Perfiles y Detalles)
  largeContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  largeText: {
    fontSize: 28,
  },
});
