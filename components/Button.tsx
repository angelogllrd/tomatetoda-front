import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

// Definimos todas las variantes posibles de botones
export type ButtonVariant =
  | "primary" // Rojo clásico (#E8321E)
  | "secondary" // Blanco con borde gris (Volver, Llamar, Ver más eventos)
  | "success" // Verde (#16A34A) (Ver datos proveedor / organizador)
  | "danger" // Blanco con texto rojo (Cerrar sesión)
  | "black" // Negro (#111) (Index / Onboarding)
  | "whatsapp" // Verde WhatsApp (#25D366)
  | "light"; // Gris claro sin borde (Cancelar / Rechazar)

// Definimos las propiedades que va a recibir nuestro botón
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant; // Por defecto será 'primary'
  icon?: keyof typeof Ionicons.glyphMap; // Para íconos de Ionicons
  isFontAwesome?: boolean; // Por si usamos el logo de WhatsApp
  style?: ViewStyle | ViewStyle[]; // Para pasarle flex: 1 u otros estilos extra
  disabled?: boolean;
  loading?: boolean;
  compact?: boolean; // Para botones "Aceptar oferta" y "Rechazar"
  iconPosition?: "left" | "right"; // Posición del icono en el boton
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  icon,
  isFontAwesome,
  style,
  disabled,
  loading,
  compact,
  iconPosition = "left", // Por defecto a la izquierda
}: ButtonProps) {
  // Función para determinar el estilo del contenedor según la variante
  const getContainerStyle = () => {
    switch (variant) {
      case "primary":
        return styles.primaryBg;
      case "secondary":
        return styles.secondaryBg;
      case "success":
        return styles.successBg;
      case "danger":
        return styles.dangerBg;
      case "black":
        return styles.blackBg;
      case "whatsapp":
        return styles.whatsappBg;
      case "light":
        return styles.lightBg;
      default:
        return styles.primaryBg;
    }
  };

  // Función para determinar el color del texto y del ícono según la variante
  const getTextColor = () => {
    switch (variant) {
      case "secondary":
        return "#333";
      case "danger":
        return "#C0392B";
      case "light":
        return "#555";
      default:
        return "#fff"; // Primary, success, black y whatsapp usan texto blanco
    }
  };

  // Función auxiliar para renderizar el ícono (evita repetir código)
  const renderIcon = () => {
    if (!icon) return null;

    const iconSize = compact ? 16 : 20; // Adaptamos tamaño
    const iconMarginStyle =
      iconPosition === "left" ? styles.iconLeft : styles.iconRight;

    if (isFontAwesome) {
      return (
        <FontAwesome
          name={icon as any}
          size={iconSize}
          color={getTextColor()}
          style={iconMarginStyle}
        />
      );
    }

    return (
      <Ionicons
        name={icon}
        size={iconSize}
        color={getTextColor()}
        style={iconMarginStyle}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.baseButton,
        getContainerStyle(),
        compact && styles.compactButton,
        disabled && styles.disabled,
        style, // Permite inyectar estilos extra
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {/* Ícono a la izquierda */}
          {iconPosition === "left" && renderIcon()}

          <Text
            style={[
              styles.baseText,
              { color: getTextColor() },
              compact && styles.compactText,
            ]}
          >
            {title}
          </Text>

          {/* Ícono a la derecha */}
          {iconPosition === "right" && renderIcon()}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // CONTENEDORES
  baseButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 8,
    // marginBottom: 12, // Margen por defecto para que no se peguen
  },
  compactButton: {
    paddingVertical: 12,
  },

  // TEXTOS
  baseText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  compactText: {
    fontSize: 14,
  },

  // ÍCONOS Y ESTADOS
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8, // Margen invertido para cuando va a la derecha
  },
  disabled: {
    opacity: 0.6,
  },

  // VARIANTES DE COLORES
  primaryBg: {
    backgroundColor: "#E8321E",
  },
  blackBg: {
    backgroundColor: "#111",
  },
  successBg: {
    backgroundColor: "#16A34A",
  },
  whatsappBg: {
    backgroundColor: "#25D366",
  },
  secondaryBg: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  dangerBg: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  lightBg: {
    backgroundColor: "#F0F0F0",
  },
});
