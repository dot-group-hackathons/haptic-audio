/**
 * Mock AudioSource: a scripted/random event generator plus a manual `simulate`
 * trigger, so the full pipeline runs without a microphone or ML model. Replace
 * with real capture + classification on device (AudioRecord / SoundAnalysis).
 */

import {
  AudioSource,
  AudioEventListener,
  Unsubscribe,
} from "../platform/AudioSource";
import {
  AudioEvent,
  AudioEventType,
  Priority,
  makeAudioEvent,
} from "../core/events";
import { Logger } from "../core/logger";

export interface MockOptions {
  /** Auto-emit a random event roughly every N ms. Omit/0 to disable. */
  randomIntervalMs?: number;
}

export class MockAudioSource implements AudioSource {
  private readonly log: Logger;
  private listeners = new Set<AudioEventListener>();
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running = false;

  constructor(
    log: Logger,
    private readonly options: MockOptions = {},
  ) {
    this.log = log.child("audio/mock");
  }

  onEvent(listener: AudioEventListener): Unsubscribe {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async start(): Promise<void> {
    if (this.running) return;
    this.running = true;
    const interval = this.options.randomIntervalMs ?? 0;
    if (interval > 0) {
      this.log.info(`starting random source (~every ${interval}ms)`);
      this.scheduleNext(interval);
    } else {
      this.log.info("started (manual trigger only)");
    }
  }

  async stop(): Promise<void> {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.log.info("stopped");
  }

  /**
   * Manually inject an event — wired to the demo buttons on screen. Not part of
   * the AudioSource interface; specific to the mock.
   */
  simulate(type: AudioEventType, overrides: Partial<AudioEvent> = {}): void {
    this.emit(
      makeAudioEvent(type, {
        priority:
          type === AudioEventType.SmokeAlarm
            ? Priority.Critical
            : overrides.priority,
        confidence: overrides.confidence,
      }),
    );
  }

  private scheduleNext(interval: number): void {
    this.timer = setTimeout(() => {
      if (!this.running) return;
      this.emit(this.randomEvent());
      this.scheduleNext(interval);
    }, jitter(interval));
  }

  private emit(event: AudioEvent): void {
    this.log.debug(`detected ${event.type} (conf ${event.confidence})`);
    for (const l of this.listeners) l(event);
  }

  private randomEvent(): AudioEvent {
    const types = Object.values(AudioEventType);
    const type = types[Math.floor(Math.random() * types.length)];
    return makeAudioEvent(type, {
      confidence: 0.5 + Math.random() * 0.5,
      priority:
        type === AudioEventType.SmokeAlarm ? Priority.Critical : Priority.Normal,
    });
  }
}

function jitter(base: number): number {
  return Math.round(base * (0.6 + Math.random() * 0.8));
}
