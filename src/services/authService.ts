import { API_ENDPOINTS } from "@config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { File } from "expo-file-system";
import { Platform } from "react-native";

// ─── Types ───────────────────────────────────────────────────────────────────

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

export interface ProfileResponse {
  success: boolean;
  message?: string;
  user: User;
  foto_url?: string;
}

export interface BasicMessageResponse {
  success: boolean;
  message: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  no_hp: string;
}

export interface UpdatePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface PhotoUploadAsset {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const STORAGE_KEY_TOKEN = "auth_token";
const STORAGE_KEY_USER = "auth_user";

// ─── Token ───────────────────────────────────────────────────────────────────

export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_TOKEN, token);
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEY_TOKEN);
}

export async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY_TOKEN);
}

// ─── User ─────────────────────────────────────────────────────────────────────

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

export async function updateStoredUser(user: User): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
}

// ─── Auth Session Helpers ─────────────────────────────────────────────────────

export async function getAuthSession(): Promise<{ token: string; user: User } | null> {
  const token = await getToken();
  const user = await getSavedUser();
  if (!token || !user) return null;
  return { token, user };
}

export async function clearAuthSession(): Promise<void> {
  await removeToken();
  await removeUser();
}

// ─── Helper Response Handler ──────────────────────────────────────────────────

async function handleApiResponse<T>(response: Response): Promise<T> {
  const json = await response.json();
  if (!response.ok && !json.success) {
    // Ambil pesan pertama dari errors Laravel jika ada
    if (json.errors) {
      const firstField = Object.values(json.errors as Record<string, string[]>)[0];
      throw new Error(firstField?.[0] ?? json.message ?? "Terjadi kesalahan.");
    }
    throw new Error(json.message ?? "Terjadi kesalahan pada server.");
  }
  return json as T;
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

// ─── Profile (GET) ───────────────────────────────────────────────────────────

export async function fetchProfileApi(token: string): Promise<ProfileResponse> {
  const res = await fetch(API_ENDPOINTS.PROFILE, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return handleApiResponse<ProfileResponse>(res);
}

// ─── Update Profil (Nama, Email, No HP) ──────────────────────────────────────

export async function updateProfileApi(
  token: string,
  payload: UpdateProfilePayload
): Promise<ProfileResponse> {
  const res = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<ProfileResponse>(res);
}

// ─── Ganti Password ───────────────────────────────────────────────────────────

export async function updatePasswordApi(
  token: string,
  payload: UpdatePasswordPayload
): Promise<BasicMessageResponse> {
  const res = await fetch(API_ENDPOINTS.UPDATE_PASSWORD, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleApiResponse<BasicMessageResponse>(res);
}

// ─── Upload Foto Profil ───────────────────────────────────────────────────────

export async function uploadProfilePhotoApi(
  token: string,
  asset: PhotoUploadAsset
): Promise<ProfileResponse> {
  const formData = new FormData();

  const fallbackExt =
    asset.mimeType === "image/png"
      ? "png"
      : asset.mimeType === "image/webp"
        ? "webp"
        : "jpg";
  const fileName = asset.fileName || `profile_${Date.now()}.${fallbackExt}`;

  if (Platform.OS === "web") {
    const blobResponse = await fetch(asset.uri);
    const blob = await blobResponse.blob();
    formData.append("foto", blob, fileName);
  } else {
    // Expo SDK 58+: gunakan expo-file-system File agar FormData multipart valid
    const file = new File(asset.uri);
    formData.append("foto", file);
  }

  // PENTING: Jangan tulis header "Content-Type" manual saat mengirim FormData
  const res = await fetch(API_ENDPOINTS.UPDATE_PHOTO, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });

  return handleApiResponse<ProfileResponse>(res);
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logoutApi(token: string): Promise<BasicMessageResponse> {
  const res = await fetch(API_ENDPOINTS.LOGOUT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  await clearAuthSession();
  return res.json();
}
