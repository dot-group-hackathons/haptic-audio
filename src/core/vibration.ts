/**
 * Vibration patterns — platform-agnostic.
 *
 * A pattern is expressed as an alternating list of millisecond durations,
 * starting with a WAIT: [wait, vibrate, wait, vibrate, ...]. This matches the
 * cross-platform convention used by React Native's `Vibration.vibrate(number[])`
 * and Android's `Vibrator`. iOS ignores the raw durations (Core Haptics works
 * differently) and instead maps a pattern to a haptic *intent* — see
 * platform/Haptics.ts and docs/IOS_FORK.md.
 */

import { AudioEvent } from "./events";

export interface VibrationPattern {
  /** Identifier used by adapters that map to platform-native effects. */
  readonly name: string;
  /**
   * Alternating [wait, vibrate, wait, vibrate, ...] durations in milliseconds.
   * The first entry is an initial delay before the first buzz.
   */
  readonly timings: readonly number[];
  /** Whether the pattern should loop until cancelled. */
  readonly repeat?: boolean;
}

/**
 * THE base pattern.
 *
 * This prototype deliberately ships a single, generic "you have an alert" buzz
 * used for EVERY audio event, regardless of type: wait 0ms, buzz 400ms,
 * pause 150ms, buzz 400ms.
 */
export const BASE_VIBRATION: VibrationPattern = {
  name: "base-alert",
  timings: [0, 400, 150, 400],
  repeat: false,
};

/**
 * Resolve which pattern to play for a given event.
 *
 * BASE PROTOTYPE: always returns {@link BASE_VIBRATION}. This function is the
 * single, intentional extension point for future "specialized vibrations" —
 * e.g. a long triple-buzz for SMOKE_ALARM vs. a soft double-tap for a KNOCK.
 * Keeping the switch here means the background service and platform adapters
 * never change when specialization is added.
 */
export function resolvePattern(_event: AudioEvent): VibrationPattern {
  // TODO(specialized-vibrations): switch on _event.type / _event.priority
  // to return distinct patterns once the design settles.
  return BASE_VIBRATION;
}

/** Total wall-clock duration of a (non-repeating) pattern, in ms. */
export function patternDurationMs(pattern: VibrationPattern): number {
  return pattern.timings.reduce((sum, t) => sum + t, 0);
}
