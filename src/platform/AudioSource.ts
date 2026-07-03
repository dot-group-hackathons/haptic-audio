/**
 * Platform abstraction: the source of audio events.
 *
 * In production this wraps microphone capture + an on-device sound classifier.
 * In this prototype the implementation is a scripted/random mock, so the whole
 * pipeline runs without a microphone or ML model.
 *
 * Implementations:
 *   - React Native (this app): MockAudioSource (timer-driven + manual triggers).
 *   - Android (later):         AudioRecord + TensorFlow Lite / MediaPipe classifier.
 *   - iOS (fork):              AVAudioEngine + SoundAnalysis (SNClassifySoundRequest).
 */

import { AudioEvent } from "../core/events";

export type AudioEventListener = (event: AudioEvent) => void;
export type Unsubscribe = () => void;

export interface AudioSource {
  /** Begin capturing / classifying. Idempotent. */
  start(): Promise<void>;

  /** Stop capturing. Idempotent. */
  stop(): Promise<void>;

  /** Subscribe to detected events. Returns an unsubscribe function. */
  onEvent(listener: AudioEventListener): Unsubscribe;
}
