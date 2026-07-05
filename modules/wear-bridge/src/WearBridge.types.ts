import type { StyleProp, ViewStyle } from 'react-native';

export type WearBridgeModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type OnTapEventPayload = Record<string, never>;

export type WearBridgeViewProps = {
  onTap: (event: { nativeEvent: OnTapEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};

export interface WearBridgeModule {
  sendLabelToWatch(label: string, score: number): void;
  vibrate(): void;

  addListener(eventName: "onLabel", listener: (event: {
    label: string;
    score: number;
  }) => void): { remove: () => void };

  removeAllListeners(eventName: "onLabel"): void;
}