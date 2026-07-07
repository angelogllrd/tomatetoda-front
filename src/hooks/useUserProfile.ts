import api from "@/src/services/api";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

// Usamos un genérico <T> porque el organizador y el proveedor tienen tipos de datos ligeramente distintos
export function useUserProfile<T>() {
  const [user, setUser] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await api.get("/user");
      setUser(response.data);
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, []),
  );

  // El hook devuelve solo lo que la pantalla necesita saber
  return { user, isLoading };
}
