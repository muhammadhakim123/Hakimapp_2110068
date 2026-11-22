import { authStyles } from "@styles/authStyles";
import { loginApi } from "@services/authService";
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  function validate(): boolean {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid.";
    }

    if (!password) {
      newErrors.password = "Kata sandi wajib diisi.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await loginApi({ email: email.trim(), password });

      if (result.success) {
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Login Gagal", result.message);
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
            <Text style={authStyles.appTitle}>Marketplace</Text>
            <Text style={authStyles.appSubtitle}>
              Kelola minimarket Anda dengan mudah
            </Text>
          </View>

          {/* Form Card */}
          <View style={authStyles.card}>
            <Text style={authStyles.cardTitle}>Masuk ke Akun</Text>
            <Text style={authStyles.cardSubtitle}>
              Gunakan email dan kata sandi yang sudah terdaftar.
            </Text>

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
                  onChangeText={(v) => {
                    setEmail(v);
                    if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                  }}
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
                  onChangeText={(v) => {
                    setPassword(v);
                    if (errors.password)
                      setErrors((e) => ({ ...e, password: undefined }));
                  }}
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

            {/* Tombol Login */}
            <TouchableOpacity
              style={[
                authStyles.primaryButton,
                loading && authStyles.primaryButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <View style={authStyles.loadingRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={authStyles.loadingText}>Memproses…</Text>
                </View>
              ) : (
                <Text style={authStyles.primaryButtonText}>Masuk</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={authStyles.footerRow}>
            <Text style={authStyles.footerText}>Belum punya akun?</Text>
            <TouchableOpacity
              onPress={() => router.push("/register")}
              disabled={loading}
            >
              <Text style={authStyles.footerLink}>Daftar Sekarang</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
