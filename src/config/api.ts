// Ganti IP ini sesuai hasil ipconfig di CMD jika pindah jaringan
export const API_BASE_URL = "http://192.168.1.12:8000/api";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  PROFILE: `${API_BASE_URL}/profile`,
  LOGOUT: `${API_BASE_URL}/logout`,
};
