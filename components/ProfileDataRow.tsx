import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProfileDataRowProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  showDivider?: boolean; // Por defecto será true, salvo que le digamos lo contrario
}

export default function ProfileDataRow({
  iconName,
  label,
  value,
  showDivider = true,
}: ProfileDataRowProps) {
  return (
    <>
      <View style={styles.infoRow}>
        <Ionicons
          name={iconName}
          size={20}
          color="#AAA"
          style={styles.infoIcon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>

      {/* Solo dibuja la línea si showDivider es verdadero */}
      {showDivider && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  infoIcon: {
    marginRight: 16,
    marginTop: 4,
  },
  textContainer: {
    flex: 1, // Para que si un texto es muy largo no rompa el diseño
  },
  infoLabel: {
    fontSize: 13,
    color: "#AAA",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#111",
  },
  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
  },
});
