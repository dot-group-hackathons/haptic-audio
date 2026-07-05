import { createModifier, type ModifierConfig } from '@expo/ui/jetpack-compose/modifiers';

export const wearBridgeComposeModifier = (params: {
  color?: number;
  width?: number;
  cornerRadius?: number;
}): ModifierConfig => createModifier('wearBridgeComposeModifier', params);
