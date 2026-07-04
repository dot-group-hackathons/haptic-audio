import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Audio Assist",
        }}
      />

      <Stack.Screen
        name="settings"
        options={{
          title: "Select Sounds",
        }}
      />
    </Stack>
  );
}