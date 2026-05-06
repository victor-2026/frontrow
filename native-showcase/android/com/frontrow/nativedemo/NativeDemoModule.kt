package com.frontrow.nativedemo

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Bridge module that lets RN code launch NativeDemoActivity. Usage from JS:
 *   import { NativeModules } from 'react-native';
 *   NativeModules.FrontRowNativeDemo.open();
 *
 * Register in NativeDemoPackage.kt and add that package to MainApplication.
 */
class NativeDemoModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "FrontRowNativeDemo"

  @ReactMethod
  fun open() {
    val ctx = reactApplicationContext.currentActivity ?: reactApplicationContext
    val intent =
      Intent(ctx, NativeDemoActivity::class.java).apply {
        if (ctx === reactApplicationContext) addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
    ctx.startActivity(intent)
  }
}
