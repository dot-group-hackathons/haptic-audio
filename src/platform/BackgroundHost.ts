/**
 * Platform abstraction: keeping the service alive while the app is not in front.
 *
 * This is the hardest capability to make truly platform-agnostic, because OS
 * rules differ sharply:
 *   - React Native (this app): tracks AppState; the JS service keeps running
 *                              while the app is foregrounded. TRUE background
 *                              execution needs a native module (see below).
 *   - Android (later):         a started Foreground Service (persistent
 *                              notification) via expo-task-manager / a config plugin.
 *   - iOS (fork):              iOS forbids arbitrary background work. A fork must
 *                              choose the `audio` background mode, BGTaskScheduler,
 *                              or silent push. See docs/IOS_FORK.md.
 *
 * The core only needs: "run this work until something tells us to stop."
 */

export interface BackgroundHost {
  /**
   * Acquire whatever the platform needs to keep running (foreground-service
   * promotion, audio session, wake lock, AppState subscription, ...).
   */
  acquire(): Promise<void>;

  /** Release background resources. */
  release(): Promise<void>;

  /**
   * Register a callback invoked when the platform asks us to shut down
   * (task expiration, user stop). Returns an unsubscribe function.
   */
  onStopRequested(handler: () => void): () => void;
}
