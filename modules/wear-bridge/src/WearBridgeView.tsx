import { requireNativeView } from 'expo';
import * as React from 'react';

import { WearBridgeViewProps } from './WearBridge.types';

const NativeView: React.ComponentType<WearBridgeViewProps> = requireNativeView('WearBridge');

export default function WearBridgeView(props: WearBridgeViewProps) {
  return <NativeView {...props} />;
}
