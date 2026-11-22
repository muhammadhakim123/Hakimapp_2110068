import { Ionicons } from "@expo/vector-icons";
import { getSavedUser, logoutApi, User } from "@services/authService";
import { tabStyles } from "@styles/tabStyles";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProfilScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSavedUser().then(setUser);
  }, []);

  async function handleLogout() {
    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar dari akun ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await logoutApi();
            } catch {
              // Lanjutkan logout lokal meski request gagal
            } finally {
              setLoading(false);
              router.replace("/login");
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      style={tabStyles.screenContainer}
      contentContainerStyle={tabStyles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar & Info */}
      <View style={tabStyles.card}>
        <View style={tabStyles.profileAvatar}>
          <Ionicons name="people" size={30} color="#2563EB" />
        </View>
        <Text style={tabStyles.sectionTitle}>
          {user?.name ?? "Memuat…"}
        </Text>
        <Text style={tabStyles.sectionSubtitle}>
          {user?.email ?? ""}
        </Text>
      </View>

      {/* Info Detail */}
      {user && (
        <View style={tabStyles.card}>
          <Text style={[tabStyles.sectionTitle, { fontSize: 15, marginBottom: 14 }]}>
            Informasi Akun
          </Text>

          <View style={profilStyles.infoRow}>
            <View style={profilStyles.infoIcon}>
              <Ionicons name="person-outline" size={18} color="#2563EB" />
            </View>
            <View style={profilStyles.infoContent}>
              <Text style={profilStyles.infoLabel}>Nama Lengkap</Text>
              <Text style={profilStyles.infoValue}>{user.name}</Text>
            </View>
          </View>

          <View style={profilStyles.divider} />

          <View style={profilStyles.infoRow}>
            <View style={profilStyles.infoIcon}>
              <Ionicons name="mail-outline" size={18} color="#2563EB" />
            </View>
            <View style={profilStyles.infoContent}>
              <Text style={profilStyles.infoLabel}>Alamat Email</Text>
              <Text style={profilStyles.infoValue}>{user.email}</Text>
            </View>
          </View>

          <View style={profilStyles.divider} />

          <View style={profilStyles.infoRow}>
            <View style={profilStyles.infoIcon}>
              <Ionicons name="call-outline" size={18} color="#2563EB" />
            </View>
            <View style={profilStyles.infoContent}>
              <Text style={profilStyles.infoLabel}>Nomor HP</Text>
              <Text style={profilStyles.infoValue}>
                {user.no_hp || "-"}
              </Text>
            </View>
          </View>

          <View style={profilStyles.divider} />

          <View style={profilStyles.infoRow}>
            <View style={profilStyles.infoIcon}>
              <Ionicons name="id-card-outline" size={18} color="#2563EB" />
            </View>
            <View style={profilStyles.infoContent}>
              <Text style={profilStyles.infoLabel}>ID Pengguna</Text>
              <Text style={profilStyles.infoValue}>#{user.id}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Tombol Logout */}
      <TouchableOpacity
        style={[tabStyles.logoutButton, loading && profilStyles.logoutDisabled]}
        activeOpacity={0.8}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#DC2626" />
        ) : (
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
        )}
        <Text style={tabStyles.logoutButtonText}>
          {loading ? "Memproses…" : "Keluar dari Akun"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const profilStyles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11.5,
    color: "#94A3B8",
    fontWeight: "600",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 10,
  },
  logoutDisabled: {
    opacity: 0.6,
  },
});
