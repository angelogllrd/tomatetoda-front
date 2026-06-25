import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MisOfertasScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Pantalla: Mis Ofertas</Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
