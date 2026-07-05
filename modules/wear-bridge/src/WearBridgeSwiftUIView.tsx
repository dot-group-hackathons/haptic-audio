import { requireNativeView } from 'expo';
import { type CommonViewModifierProps } from '@expo/ui/swift-ui';
import { createViewModifierEventListener } from '@expo/ui/swift-ui/modifiers';
import * as React from 'react';

export interface WearBridgeSwiftUIViewProps extends CommonViewModifierProps {
  title: string;
  children?: React.ReactNode;
}

const NativeWearBridgeSwiftUIView = requireNativeView<WearBridgeSwiftUIViewProps>(
  'WearBridge',
  'WearBridgeSwiftUIView'
);

export default function WearBridgeSwiftUIView({
  modifiers,
  ...rest
}: WearBridgeSwiftUIViewProps) {
  return (
    <NativeWearBridgeSwiftUIView
      modifiers={modifiers}
      {...(modifiers ? createViewModifierEventListener(modifiers) : undefined)}
      {...rest}
    />
  );
}
