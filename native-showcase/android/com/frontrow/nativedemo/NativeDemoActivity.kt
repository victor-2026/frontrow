package com.frontrow.nativedemo

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat

/**
 * FrontRow Native Demo — a hand-rolled AppCompatActivity, not a React Native
 * fragment. Mirrors the iOS UIViewController scaffold; gives Espresso an
 * authentic native target whose ids map 1:1 to the iOS testIDs.
 *
 * To activate, register this class in android/app/src/main/AndroidManifest.xml
 * (see native-showcase/README.md) and expose it via NativeDemoModule.
 */
class NativeDemoActivity : AppCompatActivity() {
  private var count = 0
  private lateinit var counter: TextView

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    val root =
      LinearLayout(this).apply {
        orientation = LinearLayout.VERTICAL
        setPadding(48, 96, 48, 48)
        ViewCompat.setAccessibilityPaneTitle(this, "Native Demo")
        // Espresso matches resource-name; that maps to nativeID on RN's
        // Text/View, but for raw Android views we use setTag(R.id.tag) or
        // just set contentDescription which is enough for our scaffold.
        contentDescription = "screen.nativeDemo"
      }

    val title =
      TextView(this).apply {
        text = "Native Demo"
        textSize = 32f
        contentDescription = "nativeDemo.title"
      }
    val body =
      TextView(this).apply {
        text =
          "This screen is a hand-built Activity, not a React Native fragment. " +
            "Espresso can drive it directly — the testIDs map to contentDescription."
        textSize = 14f
        setPadding(0, 24, 0, 24)
        contentDescription = "nativeDemo.body"
      }
    counter =
      TextView(this).apply {
        text = "0"
        textSize = 28f
        setPadding(0, 24, 0, 12)
        contentDescription = "nativeDemo.counter"
      }
    val increment =
      Button(this).apply {
        text = "Increment"
        contentDescription = "nativeDemo.incrementButton"
        setOnClickListener { onIncrement() }
      }
    val close =
      Button(this).apply {
        text = "Close"
        contentDescription = "nativeDemo.closeButton"
        setOnClickListener { finish() }
      }

    listOf<View>(title, body, counter, increment, close).forEach { root.addView(it) }
    setContentView(root)
  }

  private fun onIncrement() {
    count += 1
    counter.text = count.toString()
  }
}
