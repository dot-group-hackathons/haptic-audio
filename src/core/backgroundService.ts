/**
 * The heart of audio-assist — platform-agnostic orchestration.
 *
 * Lifecycle:
 *   start() -> acquire background host -> start audio source -> subscribe.
 *   On each detected event: apply gating (enabled, confidence, type filter,
 *   per-type cooldown) then hand accepted events to the NotificationService.
 *   stop() tears everything down.
 *
 * This class contains ZERO platform-specific code. It is driven entirely by the
 * injected `Platform`, so the same logic runs against the React Native adapter
 * today and against an iOS/Android adapter later.
 */

import { AudioEvent, AudioEventType } from "./events";
import { AppConfig, DEFAULT_CONFIG, priorityRank } from "./config";
import { NotificationService } from "./notificationService";
import { Logger } from "./logger";
import { Platform } from "../platform";
import { Unsubscribe } from "../platform/AudioSource";

export class BackgroundService {
  private readonly log: Logger;
  private readonly notifications: NotificationService;
  private config: AppConfig;

  private running = false;
  private unsubscribeSource: Unsubscribe | null = null;
  private unsubscribeStop: (() => void) | null = null;
  /** Last alert time per event type, for cooldown gating. */
  private readonly lastAlertAt = new Map<AudioEventType, number>();

  constructor(
    private readonly platform: Platform,
    log: Logger,
    config: AppConfig = DEFAULT_CONFIG,
  ) {
    this.log = log.child("service");
    this.config = config;
    this.notifications = new NotificationService(
      platform.haptics,
      platform.notifier,
      log,
    );
  }

  isRunning(): boolean {
    return this.running;
  }

  updateConfig(patch: Partial<AppConfig>): void {
    this.config = { ...this.config, ...patch };
    this.log.info("config updated");
  }

  async start(): Promise<void> {
    if (this.running) {
      this.log.warn("start() called while already running");
      return;
    }
    this.log.info(`starting on platform "${this.platform.name}"`);

    await this.platform.backgroundHost.acquire();
    this.unsubscribeStop = this.platform.backgroundHost.onStopRequested(() => {
      this.log.info("stop requested by platform");
      void this.stop();
    });

    this.unsubscribeSource = this.platform.audioSource.onEvent((event) =>
      this.handleEvent(event),
    );
    await this.platform.audioSource.start();

    this.running = true;
    this.log.info("running — listening for sounds");
  }

  async stop(): Promise<void> {
    if (!this.running) return;
    this.log.info("stopping");
    this.running = false;

    this.unsubscribeSource?.();
    this.unsubscribeSource = null;

    await this.platform.audioSource.stop();
    this.platform.haptics.cancel();

    this.unsubscribeStop?.();
    this.unsubscribeStop = null;

    await this.platform.backgroundHost.release();
    this.log.info("stopped");
  }

  /** Central gate: decide whether an event deserves an alert, then alert. */
  private handleEvent(event: AudioEvent): void {
    const decision = this.shouldAlert(event);
    if (!decision.accept) {
      this.log.debug(`ignoring ${event.type}: ${decision.reason}`);
      return;
    }
    this.lastAlertAt.set(event.type, event.detectedAt);
    // Fire-and-forget; alert() is self-contained and non-throwing per contract.
    void this.notifications.alert(event).catch((err) => {
      this.log.error("alert failed", err);
    });
  }

  private shouldAlert(event: AudioEvent): { accept: boolean; reason?: string } {
    if (!this.config.enabled)
      return { accept: false, reason: "service disabled" };

    if (event.confidence < this.config.minConfidence) {
      return { accept: false, reason: `low confidence ${event.confidence}` };
    }

    const { enabledTypes } = this.config;
    if (enabledTypes.size > 0 && !enabledTypes.has(event.type)) {
      return { accept: false, reason: "type not enabled" };
    }

    const bypassesCooldown =
      priorityRank(event.priority) >=
      priorityRank(this.config.bypassCooldownAtOrAbove);

    if (!bypassesCooldown) {
      const last = this.lastAlertAt.get(event.type);
      if (
        last !== undefined &&
        event.detectedAt - last < this.config.cooldownMs
      ) {
        return { accept: false, reason: "within cooldown" };
      }
    }

    return { accept: true };
  }
}
