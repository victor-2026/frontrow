package app.frontrow.qa

import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.isDisplayed
import androidx.test.espresso.matcher.ViewMatchers.withResourceName
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.facebook.react.ReactActivity
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Smoke test: app launches and the Events screen is the default tab.
 *
 * testIDs from src/testIds.ts become Android resource-id values, so we match
 * with `withResourceName(...)`. React Native sets these via the View's
 * `nativeID`, which Espresso surfaces as resource-name when a matcher is given.
 */
@RunWith(AndroidJUnit4::class)
class SmokeEspressoTest {
  @get:Rule
  val activityRule = ActivityScenarioRule(ReactActivity::class.java)

  @Test
  fun appLaunches_eventsTabIsVisible() {
    onView(withResourceName("screen.events")).check(matches(isDisplayed()))
  }
}
