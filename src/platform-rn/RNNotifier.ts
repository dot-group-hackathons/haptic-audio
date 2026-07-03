/**
 * React Native Notifier adapter.
 *
 * The base app treats the *vibration* as the primary alert channel, so this
 * notifier simply fans notifications out to any in-app listeners (the screen's
 * live log) and the console. A production build would add real OS notifications
 * via `expo-notifications` (Android channel + iOS UNUserNotificationCenter) —
 * that swap happens only in this file.
 */

import { Notifier, AppNotification } from "../platform/Notifier";

export type NotificationListener = (n: AppNotification) => void;

export class RNNotifier implements Notifier {
  private listeners = new Set<NotificationListener>();

  onNotification(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async notify(n: AppNotification): Promise<void> {
    console.log(`[notify] ${n.title} — ${n.body}`);
    for (const l of this.listeners) l(n);
  }
}
