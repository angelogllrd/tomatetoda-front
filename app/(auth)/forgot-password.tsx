import Button from "@/components/Button";
import HeaderBackButton from "@/components/HeaderBackButton";
import { isValidEmail } from "@/utils/validations";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendInstructions = () => {
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Ingresá tu email");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMsg("El email ingresado no es válido");
      return;
    }

    setStep(2);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBackButton title="Recuperar contraseña" />

      {/* RESTO DE LA PANTALLA GRIS */}
      <View style={styles.mainContent}>
        <View style={styles.content}>
          {step === 1 ? (
            <>
              <Text style={styles.description}>
                Ingresá tu email registrado y te enviaremos las instrucciones
                para restablecer tu contraseña.
              </Text>

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMsg("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
              ) : null}

              <Button
                title="Enviar instrucciones"
                onPress={handleSendInstructions}
              />
            </>
          ) : (
            <>
              {/* PASO 2: MENSAJE DE ÉXITO */}
              <Text style={styles.successTitle}>Email enviado</Text>
              <Text style={styles.description}>
                Revisá tu bandeja de entrada en{" "}
                <Text style={styles.boldText}>{email}</Text> y seguí las
                instrucciones para restablecer tu contraseña.
              </Text>
              <Text style={styles.descriptionSub}>
                Si no lo encontrás, revisá tu carpeta de spam.
              </Text>

              <Button
                title="Volver al inicio de sesión"
                onPress={() => router.push("/login")}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // CONTENIDO PRINCIPAL
  mainContent: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    padding: 24,
  },

  // TEXTOS Y FORMULARIO
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 24,
  },
  descriptionSub: {
    fontSize: 14,
    color: "#888",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 12,
  },
  boldText: {
    fontWeight: "bold",
    color: "#666",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  errorText: {
    color: "#C0392B",
    fontSize: 14,
    marginBottom: 16,
  },
});
