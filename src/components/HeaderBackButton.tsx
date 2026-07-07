import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderBackButtonProps {
  title: string;
  subtitle?: string; // Prop opcional para el subtítulo
  rightElement?: React.ReactNode;
}

export default function HeaderBackButton({
  title,
  subtitle,
  rightElement,
}: HeaderBackButtonProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#111" />
      </TouchableOpacity>

      {/* Contenedor central: Toma el espacio disponible y empuja el rightElement al borde */}
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        {/* Solo renderizamos el subtítulo si se pasa por prop */}
        {subtitle && (
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Elemento derecho opcional (el StatusBadge) */}
      {rightElement && (
        <View style={styles.rightContainer}>{rightElement}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 4,
    marginRight: 12,
    marginLeft: -4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  rightContainer: {
    marginLeft: 8,
  },
});
