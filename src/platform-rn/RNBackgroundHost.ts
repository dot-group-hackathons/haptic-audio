/**
 * React Native BackgroundHost adapter.
 *
 * BASE PROTOTYPE SCOPE: this keeps the JS service running and tracks foreground/
 * background transitions via `AppState`, logging when the OS backgrounds the app.
 * On both platforms, plain JS timers are throttled/suspended once the app is
 * backgrounded — so this base build reliably alerts while the app is open.
 *
 * TRUE always-on background listening requires a native capability that is NOT
 * wired here (kept out of the base app on purpose):
 *   - Android: a Foreground Service (expo-task-manager / a config plugin) with a
 *              persistent notification + FOREGROUND_SERVICE_MICROPHONE.
 *   - iOS:     the `audio` background mode (keep an AVAudioSession active),
 *              BGTaskScheduler, or silent push. See docs/IOS_FORK.md.
 */

import { AppState, AppStateStatus } from "react-native";
import { BackgroundHost } from "../platform/BackgroundHost";
import { Logger } from "../core/logger";

export class RNBackgroundHost implements BackgroundHost {
  private readonly log: Logger;
  private handlers = new Set<() => void>();
  private appStateSub: { remove: () => void } | null = null;

  constructor(log: Logger) {
    this.log = log.child("bg/rn");
  }

  async acquire(): Promise<void> {
    this.log.info("acquiring background host (tracking AppState)");
    this.appStateSub = AppState.addEventListener(
      "change",
      (state: AppStateStatus) => {
        if (state === "background" || state === "inactive") {
          this.log.warn(
            "app backgrounded — JS timers may be throttled; " +
              "true background listening needs a native foreground service (see IOS_FORK.md)",
          );
        } else if (state === "active") {
          this.log.info("app foregrounded — listening actively");
        }
      },
    );
  }

  async release(): Promise<void> {
    this.appStateSub?.remove();
    this.appStateSub = null;
    this.log.info("released background host");
  }

  onStopRequested(handler: () => void): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }
}
