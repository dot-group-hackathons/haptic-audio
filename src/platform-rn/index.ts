/**
 * Composition root for the React Native platform. This is the ONLY place that
 * knows how to build the RN adapters. An iOS-native or Android-native fork
 * provides an analogous factory with the same shape (see docs/IOS_FORK.md).
 */

import { Platform } from "../platform";
import { Logger } from "../core/logger";
import { RNHaptics } from "./RNHaptics";
import { RNNotifier } from "./RNNotifier";
import { MockAudioSource, MockOptions } from "./MockAudioSource";
import { RNBackgroundHost } from "./RNBackgroundHost";

/** The RN platform, plus the concrete adapters the UI needs to poke at directly. */
export interface RNPlatform extends Platform {
  readonly notifier: RNNotifier;
  readonly audioSource: MockAudioSource;
}

export function createRNPlatform(
  log: Logger,
  mock: MockOptions = {},
): RNPlatform {
  return {
    name: "react-native",
    haptics: new RNHaptics(),
    notifier: new RNNotifier(),
    audioSource: new MockAudioSource(log, mock),
    backgroundHost: new RNBackgroundHost(log),
  };
}

export { RNHaptics, RNNotifier, MockAudioSource, RNBackgroundHost };
