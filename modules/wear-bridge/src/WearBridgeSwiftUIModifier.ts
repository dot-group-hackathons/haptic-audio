import { createModifier, type ModifierConfig } from '@expo/ui/swift-ui/modifiers';

export const wearBridgeSwiftUIModifier = (params: {
  color?: string;
  width?: number;
  cornerRadius?: number;
}): ModifierConfig => createModifier('wearBridgeSwiftUIModifier', params);
