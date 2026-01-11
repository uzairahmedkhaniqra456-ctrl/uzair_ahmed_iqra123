import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>

        {/* 🔹 Splash Screen (FIRST SCREEN) */}
        <Stack.Screen name="splash" />

        {/* 🔹 Main App Tabs */}
        <Stack.Screen name="(tabs)" />

        {/* 🔹 Modal Screens (for auth, alerts, etc.) */}
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal" }}
        />

      </Stack>

      <StatusBar style="light" />
    </ThemeProvider>
  );
}
