/**
 * Platform-agnostic domain model for audio-assist.
 *
 * An `AudioEvent` represents an important sound that the app detected. The
 * background service turns these into vibration alerts. Nothing in this file may
 * import a platform (React Native / Expo) API — keep it pure so it can be unit
 * tested and reused across an eventual native fork.
 */

/**
 * Categories of sounds the app cares about.
 *
 * NOTE: In this BASE prototype every category is alerted with the *same*
 * generic vibration. Differentiating the haptic feedback per category
 * ("specialized vibrations") is intentionally out of scope — see
 * `resolvePattern()` in ./vibration.ts for the single extension point.
 */
export enum AudioEventType {
  Doorbell = "DOORBELL",
  Knock = "KNOCK",
  Alarm = "ALARM",
  SmokeAlarm = "SMOKE_ALARM",
  PhoneRinging = "PHONE_RINGING",
  NameCalled = "NAME_CALLED",
  BabyCrying = "BABY_CRYING",
  Appliance = "APPLIANCE_BEEP",
  Unknown = "UNKNOWN",
}

/** Relative importance. Used for logging / cooldown-bypass in the base app. */
export enum Priority {
  Low = "LOW",
  Normal = "NORMAL",
  High = "HIGH",
  Critical = "CRITICAL",
}

export interface AudioEvent {
  /** Stable id for de-duplication / cooldown tracking. */
  readonly id: string;
  readonly type: AudioEventType;
  readonly priority: Priority;
  /** Detection confidence in the range 0..1. */
  readonly confidence: number;
  /** Epoch milliseconds at which the sound was detected. */
  readonly detectedAt: number;
  /** Optional human-readable label for notifications. */
  readonly label?: string;
}

/** Convenience factory that fills in sane defaults. */
export function makeAudioEvent(
  type: AudioEventType,
  overrides: Partial<Omit<AudioEvent, "type">> = {},
): AudioEvent {
  return {
    id:
      overrides.id ??
      `${type}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    type,
    priority: overrides.priority ?? Priority.Normal,
    confidence: overrides.confidence ?? 1,
    detectedAt: overrides.detectedAt ?? Date.now(),
    label: overrides.label ?? defaultLabel(type),
  };
}

export function defaultLabel(type: AudioEventType): string {
  switch (type) {
    case AudioEventType.Doorbell:
      return "Doorbell";
    case AudioEventType.Knock:
      return "Knock at the door";
    case AudioEventType.Alarm:
      return "Alarm";
    case AudioEventType.SmokeAlarm:
      return "Smoke alarm";
    case AudioEventType.PhoneRinging:
      return "Phone ringing";
    case AudioEventType.NameCalled:
      return "Someone called your name";
    case AudioEventType.BabyCrying:
      return "Baby crying";
    case AudioEventType.Appliance:
      return "Appliance beep";
    default:
      return "Sound detected";
  }
}
