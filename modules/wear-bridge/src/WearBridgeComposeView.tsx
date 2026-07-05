import { requireNativeView } from 'expo';
import { type PrimitiveBaseProps } from '@expo/ui/jetpack-compose';
import { createViewModifierEventListener } from '@expo/ui/jetpack-compose/modifiers';
import * as React from 'react';

export interface WearBridgeComposeViewProps extends PrimitiveBaseProps {
  title: string;
  children?: React.ReactNode;
}

const NativeWearBridgeComposeView = requireNativeView<WearBridgeComposeViewProps>(
  'WearBridge',
  'WearBridgeComposeView'
);

export default function WearBridgeComposeView({
  modifiers,
  ...rest
}: WearBridgeComposeViewProps) {
  return (
    <NativeWearBridgeComposeView
      modifiers={modifiers}
      {...(modifiers ? createViewModifierEventListener(modifiers) : undefined)}
      {...rest}
    />
  );
}
