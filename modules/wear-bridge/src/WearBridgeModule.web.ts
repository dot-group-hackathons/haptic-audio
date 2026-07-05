import { registerWebModule, NativeModule } from 'expo';

import { WearBridgeModuleEvents } from './WearBridge.types';

class WearBridgeModule extends NativeModule<WearBridgeModuleEvents> {
  PI = Math.PI;

  hello() {
    return 'Hello world! 👋';
  }

  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
}

export default registerWebModule(WearBridgeModule, 'WearBridgeModule');
