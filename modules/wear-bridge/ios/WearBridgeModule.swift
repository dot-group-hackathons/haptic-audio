import ExpoModulesCore
import ExpoUI

public class WearBridgeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("WearBridge")

    Events("onChange")

    Constant("PI") {
      Double.pi
    }

    Function("hello") {
      return "Hello world! 👋"
    }

    AsyncFunction("setValueAsync") { (value: String) in
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    View(WearBridgeView.self) {
      Events("onTap")
    }

    Class(WearBridgeModuleSharedObject.self) {
      Constructor { () -> WearBridgeModuleSharedObject in
        return WearBridgeModuleSharedObject()
      }

      Property("count") { (ref: WearBridgeModuleSharedObject) -> Int in
        return ref.count
      }
      .set { (ref: WearBridgeModuleSharedObject, count: Int) in
        ref.count = count
      }
    }

    ExpoUIView(WearBridgeSwiftUIView.self)

    OnCreate {
      ViewModifierRegistry.register("wearBridgeSwiftUIModifier") { params, appContext, _ in
        return try WearBridgeSwiftUIModifier(from: params, appContext: appContext)
      }
    }

    OnDestroy {
      ViewModifierRegistry.unregister("wearBridgeSwiftUIModifier")
    }
  }
}
