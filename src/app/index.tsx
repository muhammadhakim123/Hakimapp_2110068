import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function IndexScreen() {
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const session = await getAuthSession();
      if (session) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/login");
      }
    } catch {
      router.replace("/login");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Ionicons name="storefront" size={36} color="#2563EB" />
      </View>
      <ActivityIndicator size="large" color="#2563EB" style={styles.spinner} />
      <Text style={styles.text}>Memeriksa sesi…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#EFF6FF",
    borderWidth: 2,
    borderColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    marginTop: 8,
  },
  text: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
});
