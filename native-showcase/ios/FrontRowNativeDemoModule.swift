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
      guard let root = UIApplication.shared.windows.first?.rootViewController else { return }
      let vc = FrontRowNativeDemoViewController()
      vc.modalPresentationStyle = .fullScreen
      var presenter = root
      while let presented = presenter.presentedViewController { presenter = presented }
      presenter.present(vc, animated: true)
    }
  }
}
