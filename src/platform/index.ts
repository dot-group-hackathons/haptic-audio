/**
 * The platform abstraction layer. An implementation of `Platform` is everything
 * the core needs from the outside world. Compose one per target
 * (see ../platform-rn for this app; an iOS fork mirrors its shape).
 */

export * from "./Haptics";
export * from "./Notifier";
export * from "./AudioSource";
export * from "./BackgroundHost";

import { Haptics } from "./Haptics";
import { Notifier } from "./Notifier";
import { AudioSource } from "./AudioSource";
import { BackgroundHost } from "./BackgroundHost";

/** The complete set of platform capabilities the core depends on. */
export interface Platform {
  readonly name: string;
  readonly haptics: Haptics;
  readonly notifier: Notifier;
  readonly audioSource: AudioSource;
  readonly backgroundHost: BackgroundHost;
}
