import { Stack } from "expo-router";
import { ModelProvider } from "../lib/ModelContext";

export default function RootLayout() {
  return (
    <ModelProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </ModelProvider>
  );
}
