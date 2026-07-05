import WearBridge from "../../modules/wear-bridge/src/WearBridgeModule"

const subscription = WearBridge.addListener("onLabel", (event) => {
  console.log(event.label);
  console.log(event.score);
});

// cleanup
subscription.remove();