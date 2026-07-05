import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface StatItem {
  label: string;
  value: number | string;
}

interface StatsRowProps {
  stats: StatItem[];
  style?: StyleProp<ViewStyle>; // Para permitir variaciones de margen o fondo desde afuera
}

export default function StatsRow({ stats, style }: StatsRowProps) {
  return (
    <View style={[styles.container, style]}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statBox}>
          <Text style={styles.statNumber}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8, // Separación uniforme entre las cajas
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
  },
});
