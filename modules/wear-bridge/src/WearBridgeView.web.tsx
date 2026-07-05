import * as React from 'react';

import { WearBridgeViewProps } from './WearBridge.types';

export default function WearBridgeView(props: WearBridgeViewProps) {
  return (
    <div
      style={{
        backgroundColor: '#aabbcc',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={() => props.onTap({ nativeEvent: {} })}>
      <span>WearBridge - native view</span>
      <span>Tap the view to emit a view event</span>
    </div>
  );
}
