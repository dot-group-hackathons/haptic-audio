/**
 * Platform abstraction: haptics / vibration.
 *
 * The core NEVER calls a vibration API directly — it goes through this
 * interface. Each platform provides its own implementation:
 *   - React Native (this app): react-native `Vibration`.
 *   - iOS (fork):              Core Haptics (CHHapticEngine) or UIFeedbackGenerator.
 *
 * This is the #1 file to reimplement for a native iOS fork. See docs/IOS_FORK.md.
 */

import { VibrationPattern } from "../core/vibration";

export interface Haptics {
  /** True if the device can actually vibrate (web / some tablets cannot). */
  hasVibrator(): boolean;

  /**
   * Play a pattern. Resolves once playback has been *dispatched* (not
   * necessarily finished). Implementations must be non-throwing.
   */
  vibrate(pattern: VibrationPattern): Promise<void>;

  /** Stop any in-progress vibration. */
  cancel(): void;
}
