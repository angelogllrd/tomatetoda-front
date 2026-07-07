import Button from "@/src/components/Button";
import imagePath from "@/src/constants/imagePath";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingOrgScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.skipText}>Omitir</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Image
          source={imagePath.onboardingOrg}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.tag}>PARA ORGANIZADORES</Text>
        <Text style={styles.title}>Publicá tu evento y recibí ofertas</Text>
        <Text style={styles.subtitle}>
          Contanos qué bebidas necesitás. Los proveedores te ofertarán su mejor
          precio.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>

        <Button
          title="Siguiente"
          onPress={() => router.push("/onboarding-proveedor")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  skipButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
  },
  skipText: {
    color: "#999",
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 32,
  },
  tag: {
    color: "#E8321E",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  footer: {
    paddingBottom: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#E8321E",
    width: 24,
  },
});
