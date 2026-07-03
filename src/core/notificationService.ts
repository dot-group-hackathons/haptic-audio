/**
 * Turns an accepted AudioEvent into a vibration + user notification.
 * Platform-agnostic: depends only on the Haptics/Notifier interfaces.
 */

import { AudioEvent } from "./events";
import { resolvePattern } from "./vibration";
import { Logger } from "./logger";
import { Haptics } from "../platform/Haptics";
import { Notifier } from "../platform/Notifier";

export class NotificationService {
  private readonly log: Logger;

  constructor(
    private readonly haptics: Haptics,
    private readonly notifier: Notifier,
    log: Logger,
  ) {
    this.log = log.child("notify");
  }

  /** Alert the user about a single event: buzz first, then post a notification. */
  async alert(event: AudioEvent): Promise<void> {
    const pattern = resolvePattern(event);
    this.log.info(
      `alerting "${event.label ?? event.type}" with pattern "${pattern.name}"`,
    );

    // Haptics first — it is the primary channel for this app.
    if (this.haptics.hasVibrator()) {
      await this.haptics.vibrate(pattern);
    } else {
      this.log.warn("no vibrator available; relying on notification only");
    }

    await this.notifier.notify({
      title: event.label ?? "Sound detected",
      body: `Detected ${event.type} (${Math.round(event.confidence * 100)}% confidence)`,
      channel: "audio-assist-alerts",
    });
  }
}
