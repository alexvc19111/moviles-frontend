// src/api/axiosClient.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Detectar URL correcta según dispositivo
const API_URL = Platform.OS === 'android' 
    ? 'http://10.0.2.2:8000/api' 
    : 'http://localhost:8000/api';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Interceptor: Antes de enviar, inyectar el token si existe
axiosClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@token"); // Asegúrate que la clave sea la misma que en el Context
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;