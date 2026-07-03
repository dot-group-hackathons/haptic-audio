/**
 * Minimal leveled logger. Uses the global `console`, which exists on every
 * target runtime (React Native, Node, browsers), so it stays platform-agnostic.
 * An optional sink lets the UI mirror log lines on screen.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogSink = (level: LogLevel, scope: string, message: string) => void;

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export class Logger {
  constructor(
    private readonly scope: string,
    private readonly minLevel: LogLevel = "info",
    private readonly sink?: LogSink,
  ) {}

  child(scope: string): Logger {
    return new Logger(`${this.scope}:${scope}`, this.minLevel, this.sink);
  }

  debug(msg: string, ...args: unknown[]): void {
    this.log("debug", msg, args);
  }
  info(msg: string, ...args: unknown[]): void {
    this.log("info", msg, args);
  }
  warn(msg: string, ...args: unknown[]): void {
    this.log("warn", msg, args);
  }
  error(msg: string, ...args: unknown[]): void {
    this.log("error", msg, args);
  }

  private log(level: LogLevel, msg: string, args: unknown[]): void {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[this.minLevel]) return;
    const stamp = new Date().toISOString().slice(11, 23);
    const line = `${stamp} [${level.toUpperCase()}] ${this.scope} — ${msg}`;
    const fn = (console as unknown as Record<string, typeof console.log>)[level];
    (fn ?? console.log)(line, ...args);
    this.sink?.(level, this.scope, msg);
  }
}
