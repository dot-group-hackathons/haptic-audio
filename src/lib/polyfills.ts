// Load before any module (whisper.rn) that expects Node's Buffer at runtime.
import { Buffer } from "buffer";

if (typeof (global as any).Buffer === "undefined") {
  (global as any).Buffer = Buffer;
}
