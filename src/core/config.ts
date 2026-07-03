/**
 * Runtime configuration for the background service. Platform-agnostic.
 */

import { AudioEventType, Priority } from "./events";

export interface AppConfig {
  /** Master switch. When false the service ignores all detected events. */
  enabled: boolean;
  /**
   * Per-event-type cooldown. After alerting for a type, further events of the
   * same type within this window are suppressed so the user is not buzzed
   * continuously by, e.g., a ringing phone.
   */
  cooldownMs: number;
  /** Ignore detections below this confidence. */
  minConfidence: number;
  /** Event types the user has opted into. Empty set = all types. */
  enabledTypes: Set<AudioEventType>;
  /** Never suppress events at/above this priority, regardless of cooldown. */
  bypassCooldownAtOrAbove: Priority;
}

export const DEFAULT_CONFIG: AppConfig = {
  enabled: true,
  cooldownMs: 8000,
  minConfidence: 0.5,
  enabledTypes: new Set(), // all
  bypassCooldownAtOrAbove: Priority.Critical,
};

const PRIORITY_RANK: Record<Priority, number> = {
  [Priority.Low]: 0,
  [Priority.Normal]: 1,
  [Priority.High]: 2,
  [Priority.Critical]: 3,
};

export function priorityRank(p: Priority): number {
  return PRIORITY_RANK[p];
}
