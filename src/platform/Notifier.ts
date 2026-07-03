/**
 * Platform abstraction: user-visible notifications that accompany a buzz.
 *
 * Implementations:
 *   - React Native (this app): in-app callback (drives the on-screen log).
 *   - Android (later):         NotificationManager + foreground-service notification.
 *   - iOS (fork):              UNUserNotificationCenter (local notifications).
 */

export interface AppNotification {
  readonly title: string;
  readonly body: string;
  /** Category id, used by the platform to group / theme notifications. */
  readonly channel?: string;
}

export interface Notifier {
  notify(notification: AppNotification): Promise<void>;
}
