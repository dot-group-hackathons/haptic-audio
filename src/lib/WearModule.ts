import WearBridge from "../../modules/wear-bridge/src/WearBridgeModule"

export function sendLabelToWatch(label: string, score: number) {
  WearBridge.sendLabelToWatch(label, score);
}

export function vibrateWatch() {
  WearBridge.vibrate();
}