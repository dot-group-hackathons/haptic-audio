import SwiftUI
import ExpoModulesCore
import ExpoUI

final class WearBridgeSwiftUIViewProps: UIBaseViewProps {
  @Field var title: String = ""
}

struct WearBridgeSwiftUIView: ExpoSwiftUI.View {
  @ObservedObject public var props: WearBridgeSwiftUIViewProps

  var body: some View {
    VStack {
      Text(props.title)
        .font(.headline)
      Children()
    }
  }
}
