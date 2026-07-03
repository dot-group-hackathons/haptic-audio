/**
 * React Native Haptics adapter using the built-in `Vibration` API (no extra
 * dependency). The core's `VibrationPattern.timings` are already in RN's
 * `[wait, vibrate, wait, vibrate, ...]` format, so mapping is direct.
 *
 * Platform notes:
 *   - Android: honours the exact millisecond timings.
 *   - iOS:     RN's Vibration ignores durations (buzzes a fixed ~400ms per
 *              entry). A richer iOS build should swap this for Core Haptics —
 *              see docs/IOS_FORK.md. That is exactly why timings live behind
 *              this interface.
 *   - Web:     no vibrator; hasVibrator() returns false.
 */

import { Platform as RNPlatform, Vibration } from "react-native";
import { Haptics } from "../platform/Haptics";
import { VibrationPattern } from "../core/vibration";

export class RNHaptics implements Haptics {
  hasVibrator(): boolean {
    return RNPlatform.OS === "ios" || RNPlatform.OS === "android";
  }

  async vibrate(pattern: VibrationPattern): Promise<void> {
    if (!this.hasVibrator()) return;
    try {
      // RN accepts a number[] pattern (mutable), so copy the readonly timings.
      Vibration.vibrate([...pattern.timings], pattern.repeat ?? false);
    } catch {
      // Non-throwing per the Haptics contract.
    }
  }

  cancel(): void {
    try {
      Vibration.cancel();
    } catch {
      /* ignore */
    }
  }
}
