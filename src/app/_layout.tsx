import "../lib/polyfills"; // must run before whisper.rn / safe-buffer load
import { VibrationPatternsProvider } from "@/lib/VibrationPatternsContext";
import { Stack } from "expo-router";
import { ModelProvider } from "../lib/ModelContext";
import { WhisperProvider } from "../lib/WhisperContext";

export default function RootLayout() {
  return (
    <ModelProvider>
      <WhisperProvider>
        <VibrationPatternsProvider>
          {/* The app renders its own header/nav ("HapticAudio" UI), so hide the native stack header. */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </VibrationPatternsProvider>
      </WhisperProvider>
    </ModelProvider>
  );
}
