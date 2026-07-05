import { SharedObject, useReleasingSharedObject } from 'expo-modules-core';

import WearBridgeModule from './WearBridgeModule';

export declare class WearBridgeModuleSharedObject extends SharedObject {
  count: number;
}

/**
 * Creates a new WearBridgeModuleSharedObject instance.
 * You are responsible for releasing it from memory by calling `release()` when done.
 */
export function createWearBridgeModuleSharedObject(): WearBridgeModuleSharedObject {
  return new WearBridgeModule.WearBridgeModuleSharedObject();
}

/**
 * A hook that creates a WearBridgeModuleSharedObject instance and automatically
 * releases it when the component unmounts.
 */
export function useWearBridgeModuleSharedObject(): WearBridgeModuleSharedObject {
  return useReleasingSharedObject(() => new WearBridgeModule.WearBridgeModuleSharedObject(), []);
}
