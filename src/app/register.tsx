import { authStyles } from "@styles/authStyles";
import { registerApi } from "@services/authService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormErrors {
  name?: string;
  email?: string;
  no_hp?: string;
  password?: string;
  password_confirmation?: string;
}

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [no_hp, setNoHp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const e: FormErrors = {};

    if (!name.trim()) e.name = "Nama lengkap wajib diisi.";

    if (!email.trim()) {
      e.email = "Email wajib diisi.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      e.email = "Format email tidak valid.";
    }

    if (!no_hp.trim()) {
      e.no_hp = "Nomor HP wajib diisi.";
    } else if (!/^[0-9+\-\s]{8,20}$/.test(no_hp)) {
      e.no_hp = "Format nomor HP tidak valid.";
    }

    if (!password) {
      e.password = "Kata sandi wajib diisi.";
    } else if (password.length < 6) {
      e.password = "Kata sandi minimal 6 karakter.";
    }

    if (!passwordConfirm) {
      e.password_confirmation = "Konfirmasi kata sandi wajib diisi.";
    } else if (password !== passwordConfirm) {
      e.password_confirmation = "Konfirmasi kata sandi tidak cocok.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await registerApi({
        name: name.trim(),
        email: email.trim(),
        no_hp: no_hp.trim(),
        password,
        password_confirmation: passwordConfirm,
      });

      if (result.success) {
        Alert.alert("Registrasi Berhasil", `Selamat datang, ${result.user?.name}!`, [
          { text: "Lanjutkan", onPress: () => router.replace("/(tabs)/home") },
        ]);
      } else {
        // Laravel mengembalikan error validasi sebagai pesan
        Alert.alert("Registrasi Gagal", result.message);
      }
    } catch {
      Alert.alert(
        "Koneksi Gagal",
        "Tidak dapat terhubung ke server. Pastikan server menyala dan IP di api.ts sudah benar."
      );
    } finally {
      setLoading(false);
    }
  }

  function clearError(field: keyof FormErrors) {
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={authStyles.logoWrapper}>
            <View style={authStyles.logoBox}>
              <Ionicons name="storefront" size={36} color="#2563EB" />
            </View>
            <Text style={authStyles.appTitle}>Daftar Akun</Text>
            <Text style={authStyles.appSubtitle}>
              Isi data di bawah untuk membuat akun baru
            </Text>
          </View>

          {/* Form Card */}
          <View style={authStyles.card}>
            <Text style={authStyles.cardTitle}>Buat Akun Baru</Text>
            <Text style={authStyles.cardSubtitle}>
              Semua kolom wajib diisi kecuali foto profil.
            </Text>

            {/* Nama */}
            <View style={authStyles.inputGroup}>
              <Text style={authStyles.inputLabel}>Nama Lengkap</Text>
              <View
                style={[
                  authStyles.inputWrapper,
                  focusedField === "name" && authStyles.inputWrapperFocused,
                  errors.name ? authStyles.inputWrapperError : undefined,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={errors.name ? "#EF4444" : "#94A3B8"}
                  style={authStyles.inputIcon}
                />
                <TextInput
                  style={authStyles.input}
                  placeholder="Muhammad Hakim"
                  placeholderTextColor="#CBD5E1"
                  value={name}
                  onChangeText={(v) => { setName(v); clearError("name"); }}
                  autoCapitalize="words"
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  editable={!loading}
                />
              </View>
              {errors.name && (
                <Text style={authStyles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Email */}
            <View style={authStyles.inputGroup}>
              <Text style={authStyles.inputLabel}>Alamat Email</Text>
              <View
                style={[
                  authStyles.inputWrapper,
                  focusedField === "email" && authStyles.inputWrapperFocused,
                  errors.email ? authStyles.inputWrapperError : undefined,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={errors.email ? "#EF4444" : "#94A3B8"}
                  style={authStyles.inputIcon}
                />
                <TextInput
                  style={authStyles.input}
                  placeholder="contoh@email.com"
                  placeholderTextColor="#CBD5E1"
                  value={email}
                  onChangeText={(v) => { setEmail(v); clearError("email"); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  editable={!loading}
                />
              </View>
              {errors.email && (
                <Text style={authStyles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* No HP */}
            <View style={authStyles.inputGroup}>
              <Text style={authStyles.inputLabel}>Nomor HP</Text>
              <View
                style={[
                  authStyles.inputWrapper,
                  focusedField === "no_hp" && authStyles.inputWrapperFocused,
                  errors.no_hp ? authStyles.inputWrapperError : undefined,
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={errors.no_hp ? "#EF4444" : "#94A3B8"}
                  style={authStyles.inputIcon}
                />
                <TextInput
                  style={authStyles.input}
                  placeholder="081234567890"
                  placeholderTextColor="#CBD5E1"
                  value={no_hp}
                  onChangeText={(v) => { setNoHp(v); clearError("no_hp"); }}
                  keyboardType="phone-pad"
                  onFocus={() => setFocusedField("no_hp")}
                  onBlur={() => setFocusedField(null)}
                  editable={!loading}
                />
              </View>
              {errors.no_hp && (
                <Text style={authStyles.errorText}>{errors.no_hp}</Text>
              )}
            </View>

            {/* Password */}
            <View style={authStyles.inputGroup}>
              <Text style={authStyles.inputLabel}>Kata Sandi</Text>
              <View
                style={[
                  authStyles.inputWrapper,
                  focusedField === "password" && authStyles.inputWrapperFocused,
                  errors.password ? authStyles.inputWrapperError : undefined,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={errors.password ? "#EF4444" : "#94A3B8"}
                  style={authStyles.inputIcon}
                />
                <TextInput
                  style={authStyles.input}
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor="#CBD5E1"
                  value={password}
                  onChangeText={(v) => { setPassword(v); clearError("password"); }}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  disabled={loading}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={authStyles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Konfirmasi Password */}
            <View style={authStyles.inputGroup}>
              <Text style={authStyles.inputLabel}>Konfirmasi Kata Sandi</Text>
              <View
                style={[
                  authStyles.inputWrapper,
                  focusedField === "password_confirmation" &&
                    authStyles.inputWrapperFocused,
                  errors.password_confirmation
                    ? authStyles.inputWrapperError
                    : undefined,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={errors.password_confirmation ? "#EF4444" : "#94A3B8"}
                  style={authStyles.inputIcon}
                />
                <TextInput
                  style={authStyles.input}
                  placeholder="Ulangi kata sandi"
                  placeholderTextColor="#CBD5E1"
                  value={passwordConfirm}
                  onChangeText={(v) => {
                    setPasswordConfirm(v);
                    clearError("password_confirmation");
                  }}
                  secureTextEntry={!showPasswordConfirm}
                  onFocus={() => setFocusedField("password_confirmation")}
                  onBlur={() => setFocusedField(null)}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPasswordConfirm((v) => !v)}
                  disabled={loading}
                >
                  <Ionicons
                    name={showPasswordConfirm ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
              {errors.password_confirmation && (
                <Text style={authStyles.errorText}>
                  {errors.password_confirmation}
                </Text>
              )}
            </View>

            {/* Tombol Daftar */}
            <TouchableOpacity
              style={[
                authStyles.primaryButton,
                loading && authStyles.primaryButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <View style={authStyles.loadingRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={authStyles.loadingText}>Mendaftar…</Text>
                </View>
              ) : (
                <Text style={authStyles.primaryButtonText}>Buat Akun</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={authStyles.footerRow}>
            <Text style={authStyles.footerText}>Sudah punya akun?</Text>
            <TouchableOpacity
              onPress={() => router.replace("/login")}
              disabled={loading}
            >
              <Text style={authStyles.footerLink}>Masuk di Sini</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
