package com.frontrow.nativedemo

import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withContentDescription
import androidx.test.espresso.matcher.ViewMatchers.withText
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Espresso test for the hand-rolled NativeDemoActivity. Demonstrates that
 * the same testIDs we use across the React Native screens (where they
 * map to nativeID -> resource-name) work for Android-native code, where
 * we set them as contentDescription on the View directly.
 *
 * Run with:
 *   ./gradlew connectedAndroidTest -Pandroid.testInstrumentationRunnerArguments.class=com.frontrow.nativedemo.NativeDemoActivityTest
 */
@RunWith(AndroidJUnit4::class)
class NativeDemoActivityTest {
  @get:Rule val activityRule = ActivityScenarioRule(NativeDemoActivity::class.java)

  @Test
  fun activityRenders() {
    onView(withContentDescription("screen.nativeDemo")).check(matches(isDisplayed()))
    onView(withContentDescription("nativeDemo.title")).check(matches(withText("Native Demo")))
  }

  @Test
  fun incrementButtonUpdatesCounter() {
    onView(withContentDescription("nativeDemo.counter")).check(matches(withText("0")))
    onView(withContentDescription("nativeDemo.incrementButton")).perform(click())
    onView(withContentDescription("nativeDemo.incrementButton")).perform(click())
    onView(withContentDescription("nativeDemo.counter")).check(matches(withText("2")))
  }
}
