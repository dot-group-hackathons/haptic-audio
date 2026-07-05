import { requireNativeModule } from "expo-modules-core";
import type { WearBridgeModule } from "./WearBridge.types";

const WearBridge = requireNativeModule("WearBridge") as WearBridgeModule;

export default WearBridge;