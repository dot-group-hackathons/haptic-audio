# audio-assist architecture

A background service that listens for important sounds (doorbell, smoke alarm,
your name, a crying baby…) and alerts the user with a **vibration**. Aimed at
people who are deaf or hard of hearing.

This is the **base build**, intentionally scoped down:

- ✅ Runs as a service with start/stop lifecycle.
- ✅ Alerts via vibration (+ an in-app notification log).
- ✅ **One generic vibration for every event** — no specialized per-sound
  patterns yet. That specialization has a single, marked extension point.
- ✅ **Platform-agnostic core.** No file under `src/core/` imports React Native.
  Platforms plug in through the interfaces in `src/platform/`.

## Layers

```
        src/core/            platform-agnostic — no RN/OS imports
   events · vibration · config · logger
   NotificationService · BackgroundService
                 │  depends only on interfaces ↓
        src/platform/        the seam (interfaces)
   Haptics · Notifier · AudioSource · BackgroundHost · Platform
                 │  implemented by ↓
        src/platform-rn/     React Native adapters (this app)
   RNHaptics · RNNotifier · MockAudioSource · RNBackgroundHost
                 │  wired by ↓
        src/app/index.tsx    Expo Router screen (Start/Stop + demo UI)
```

**Flow:** `AudioSource` detects a sound → `BackgroundService` gates it (enabled?
confident enough? not in cooldown? critical bypasses cooldown) →
`NotificationService` resolves a `VibrationPattern` and drives `Haptics` +
`Notifier`. `BackgroundHost` manages staying alive.

## Directory map

| Path                  | Platform-agnostic?  | Purpose                                             |
| --------------------- | ------------------- | --------------------------------------------------- |
| `src/core/`           | **Yes**             | Domain model, gating, notification orchestration    |
| `src/platform/`       | **Yes** (contracts) | Interfaces every platform implements                |
| `src/platform-rn/`    | No (React Native)   | RN adapters — built-in `Vibration`, mock sound source |
| `src/app/`            | No (Expo Router)    | UI / composition root                               |

## Try it

```bash
npm install
npm run android   # or: npm run ios   /   npm run web
```

Tap **Start**, then a **Simulate** button. Watch: the phone buzzes, the activity
log records the alert, a rapidly-repeated sound is suppressed by the cooldown,
and a Smoke alarm (Critical) bypasses that cooldown. On a physical Android/iOS
device you feel the vibration; web/simulator shows the log only.

## Where "specialized vibrations" will go

One function decides the buzz: `resolvePattern(event)` in
[`src/core/vibration.ts`](../src/core/vibration.ts). It currently always returns
`BASE_VIBRATION`. Add a `switch` on `event.type` / `event.priority` there and
define new patterns next to it — **nothing else in the codebase changes**.

## Porting / iOS fork

See [IOS_FORK.md](./IOS_FORK.md).
