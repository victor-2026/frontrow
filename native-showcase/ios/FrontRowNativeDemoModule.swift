import Foundation
import React

/// Bridge module that lets RN code present FrontRowNativeDemoViewController.
/// Usage from JS:
///   import { NativeModules } from 'react-native';
///   NativeModules.FrontRowNativeDemo.open();
///
/// The module is intentionally minimal — `open` presents modally; `close`
/// dismisses. Anything more complex (passing data in/out) lives on the
/// view controller itself.
@objc(FrontRowNativeDemoModule)
public final class FrontRowNativeDemoModule: NSObject {
  @objc public static func requiresMainQueueSetup() -> Bool { true }

  @objc public func open() {
    DispatchQueue.main.async {
      // UIApplication.shared.windows is deprecated in iOS 15 and, more
      // importantly, returns *all* connected windows including ones
      // belonging to XCUITest's runner — under Maestro that surfaces
      // first and the present() lands in a window the user never sees.
      // Walk the connected scenes for the key window of the foreground
      // active scene instead.
      let key = UIApplication.shared.connectedScenes
        .compactMap { $0 as? UIWindowScene }
        .filter { $0.activationState == .foregroundActive }
        .flatMap { $0.windows }
        .first { $0.isKeyWindow }
      guard let root = key?.rootViewController else { return }
      let vc = FrontRowNativeDemoViewController()
      vc.modalPresentationStyle = .fullScreen
      var presenter = root
      while let presented = presenter.presentedViewController { presenter = presented }
      presenter.present(vc, animated: true)
    }
  }
}
