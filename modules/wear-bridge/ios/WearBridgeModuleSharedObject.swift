import ExpoModulesCore

public class WearBridgeModuleSharedObject: SharedObject {
  var count: Int = 0

  override public func sharedObjectDidRelease() {
    super.sharedObjectDidRelease()
  }
}
