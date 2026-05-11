// Objective-C bridge that registers FrontRowNativeDemoModule with the
// React Native bridge. The Swift @objc class alone is not enough —
// RCT_EXTERN_*_MODULE is what makes the module visible as
// NativeModules.FrontRowNativeDemo from JS.
//
// We use the REMAP variant because the JS-visible module name
// (FrontRowNativeDemo) intentionally differs from the Swift class name
// (FrontRowNativeDemoModule), matching the Kotlin getName() on Android.

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_REMAP_MODULE(FrontRowNativeDemo, FrontRowNativeDemoModule, NSObject)

RCT_EXTERN_METHOD(open)

@end
