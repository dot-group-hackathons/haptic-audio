# iOS fork guide

This app is cross-platform Expo/React Native, so **iOS already runs from the same
JS** — the base build vibrates on iOS via `react-native`'s `Vibration`. This doc
covers what a *dedicated iOS build* changes to get real background listening and
richer haptics. The whole point of the `src/platform/` seam is that **you never
touch `src/core/`.**

## Two levels of "iOS fork"

### Level 1 — stays in this Expo codebase (recommended first)
Swap only the RN adapters for iOS-stronger implementations. Files:

| # | File                                   | Change                                                                 |
| - | -------------------------------------- | ---------------------------------------------------------------------- |
| 1 | `src/platform-rn/RNHaptics.ts`         | Replace `Vibration` with **`expo-haptics`** (or a Core Haptics native module) so timings/intensity are honoured on iOS. |
| 2 | `src/platform-rn/RNNotifier.ts`        | Add **`expo-notifications`** local notifications (iOS `UNUserNotificationCenter`). |
| 3 | `src/platform-rn/RNBackgroundHost.ts`  | Add a real background strategy (see the table below) via **`expo-task-manager`** / an `AVAudioSession` config plugin. |
| 4 | `src/platform-rn/MockAudioSource.ts`   | Replace the mock with real capture + classification (a native module wrapping **AVAudioEngine + SoundAnalysis**). |
| 5 | `app.json`                             | Add iOS `infoPlist` keys + `UIBackgroundModes` (below).                |

Nothing in `src/core/` or `src/platform/` (the interfaces) changes.

### Level 2 — a native Swift rewrite of the core
If the team abandons RN for pure Swift, port `src/core/` (it is small and pure)
1:1 to Swift and implement the same four protocols (`Haptics`, `Notifier`,
`AudioSource`, `BackgroundHost`). The interface boundary is identical.

## Haptics on iOS

RN's `Vibration` **ignores the millisecond timings** on iOS (fixed ~400 ms
buzzes). Because the core hands adapters a `VibrationPattern`, not raw device
calls, upgrading is local to `RNHaptics.ts`:
- Simple: `expo-haptics` `notificationAsync(Warning)` / `impactAsync(Heavy)`.
- Rich (and where future *specialized* vibrations map best): **Core Haptics** —
  build a `CHHapticPattern` from `CHHapticEvent`s on a `CHHapticEngine` (needs a
  small native module or a dev build).
- Requires a physical device with a Taptic Engine; the simulator is silent, so
  `hasVibrator()` should return false there.

## Background execution on iOS (the hard part)

iOS forbids arbitrary long-running background work — there is no equivalent of an
Android foreground service. Pick a strategy in `RNBackgroundHost.ts`:

| Strategy                    | When it fits                                 | Limitation                                                      |
| --------------------------- | -------------------------------------------- | -------------------------------------------------------------- |
| **`audio` background mode** | Continuous mic listening (our main use case) | Must keep an `AVAudioSession` active; battery-heavy; App Review requires a genuine audio purpose. |
| **`BGTaskScheduler`**       | Periodic checks, not continuous              | OS decides timing; not real-time; short budgets.               |
| **Silent remote push**      | A server detects/relays events               | Requires a backend + APNs; only brief wake-ups.                |
| **Local only**              | App in foreground / recently used            | No true background listening.                                  |

For a like-for-like port of this base app, the **`audio` background mode** is the
closest match: keep the `AVAudioSession` (`.record`/`.playAndRecord`,
`.mixWithOthers`) active so capture continues with the screen off.

## `app.json` keys (item 5)

```jsonc
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSMicrophoneUsageDescription": "audio-assist listens for important sounds and alerts you by vibration.",
        "UIBackgroundModes": ["audio"]
      }
    }
  }
}
```

(Add `"processing"` for `BGTaskScheduler` or `"remote-notification"` for silent
push if you use those strategies.)
