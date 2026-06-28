import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Centralizamos la IP local acá. Si cambia, solo la cambiamos en este archivo.
const API_URL = "http://192.168.100.4:8000/api";

// Creamos una "instancia" personalizada de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Antes de que CUALQUIER petición salga de tu app hacia Laravel, el interceptor la frena,
// busca el token en el celular, se lo pega (headers) y la deja seguir.
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
