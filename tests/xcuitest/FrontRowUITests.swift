import XCTest

/// Smoke + auth + buy ticket flows driven through the FrontRow React Native UI.
/// testIDs from `src/testIds.ts` are surfaced as `accessibilityIdentifier`s on
/// iOS, so each `XCUIElement` is queried by the same string used in TS.
final class FrontRowUITests: XCTestCase {
  override func setUpWithError() throws {
    continueAfterFailure = false
  }

  func testAppLaunches_EventsScreenIsVisible() throws {
    let app = XCUIApplication()
    app.launch()

    let events = app.otherElements["screen.events"]
    XCTAssertTrue(events.waitForExistence(timeout: 10))
  }

  func testSignIn_WithDemoCredentials() throws {
    let app = XCUIApplication()
    app.launch()

    app.tabBars.buttons["Profile"].tap()

    let signIn = app.buttons["profile.signInButton"]
    XCTAssertTrue(signIn.waitForExistence(timeout: 5))
    signIn.tap()

    let email = app.textFields["login.emailInput"]
    email.tap()
    email.typeText("demo@frontrow.app")

    let password = app.secureTextFields["login.passwordInput"]
    password.tap()
    password.typeText("demo1234")

    app.buttons["profile.signInButton"].tap()

    XCTAssertTrue(app.staticTexts["Demo User"].waitForExistence(timeout: 5))
  }
}
