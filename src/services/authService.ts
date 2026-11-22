import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "@config/api";

export interface User {
  id: number;
  name: string;
  email: string;
  no_hp: string;
  foto: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

const STORAGE_KEY_TOKEN = "auth_token";
const STORAGE_KEY_USER = "auth_user";

// ─── Simpan & Ambil Token ────────────────────────────────────────────────────

export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_TOKEN, token);
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEY_TOKEN);
}

export async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY_TOKEN);
}

// ─── Simpan & Ambil Data User ────────────────────────────────────────────────

export async function saveUser(user: User): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
}

export async function getSavedUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY_USER);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function removeUser(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY_USER);
}

// ─── Register ────────────────────────────────────────────────────────────────

export async function registerApi(data: {
  name: string;
  email: string;
  no_hp: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthResponse> {
  const res = await fetch(API_ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });

  const json: AuthResponse = await res.json();

  if (json.success && json.token && json.user) {
    await saveToken(json.token);
    await saveUser(json.user);
  }

  return json;
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function loginApi(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(API_ENDPOINTS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });

  const json: AuthResponse = await res.json();

  if (json.success && json.token && json.user) {
    await saveToken(json.token);
    await saveUser(json.user);
  }

  return json;
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function profileApi(): Promise<AuthResponse> {
  const token = await getToken();

  const res = await fetch(API_ENDPOINTS.PROFILE, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  return res.json();
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logoutApi(): Promise<AuthResponse> {
  const token = await getToken();

  const res = await fetch(API_ENDPOINTS.LOGOUT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const json: AuthResponse = await res.json();

  // Hapus data lokal apapun hasilnya
  await removeToken();
  await removeUser();

  return json;
}
