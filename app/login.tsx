import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Función para rellenar datos de prueba
  const handleDemoLogin = (role: "org" | "prov") => {
    setErrorMsg("");
    if (role === "org") {
      setEmail("maria@demo.com");
      setPassword("123456");
    } else {
      setEmail("carlos@demo.com");
      setPassword("123456");
    }
  };

  const handleLogin = () => {
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Completá todos los campos");
      return;
    }
    if (email === "maria@demo.com" && password === "123456") {
      router.push("/(tabs-org)/home-organizador");
    } else if (email === "carlos@demo.com" && password === "123456") {
      router.push("/(tabs-prov)/home-proveedor");
    } else {
      setErrorMsg(
        "Usuario no encontrado. Probá con alguno de los usuarios demo",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo1.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>TomateToda</Text>
        <Text style={styles.subtitle}>Iniciá sesión para continuar</Text>
      </View>

      <View style={styles.demoBox}>
        <Text style={styles.demoTitle}>Acceso demo rápido</Text>
        <View style={styles.demoButtons}>
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={() => handleDemoLogin("org")}
          >
            <Text style={styles.demoBtnText}>Organizador</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={() => handleDemoLogin("prov")}
          >
            <Text style={styles.demoBtnText}>Proveedor</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.form}>
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

        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrorMsg("");
            }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.registerText}>
            ¿No tenés cuenta?{" "}
            <Text style={styles.registerTextBold}>Registrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginTop: 4,
  },
  demoBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 24,
  },
  demoTitle: {
    fontSize: 12,
    color: "#888",
    marginBottom: 12,
  },
  demoButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  demoBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  demoBtnText: {
    color: "#333",
    fontSize: 14,
  },
  form: {
    marginBottom: 16,
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
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: {
    color: "#C0392B",
    fontSize: 14,
    marginBottom: 12,
  },
  forgotText: {
    color: "#E8321E",
    textAlign: "right",
    fontSize: 14,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "#E8321E",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
  },
  registerText: {
    color: "#888",
    fontSize: 14,
  },
  registerTextBold: {
    color: "#E8321E",
    fontWeight: "bold",
  },
});
