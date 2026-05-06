import XCTest

/// XCUITest scaffold for the FrontRowNativeDemoViewController.
///
/// Assumes the bridge module has been wired up so a JS-driven button
/// (Debug → "Open native demo") presents the screen. The test launches
/// the app, navigates through that path, and asserts the same testIDs
/// XCUITest uses across the JS-driven screens — proving the
/// accessibilityIdentifier contract works end-to-end on the native
/// surface.
final class NativeDemoTests: XCTestCase {
  override func setUpWithError() throws {
    continueAfterFailure = false
  }

  func testNativeDemoOpens_AndIncrementUpdatesCounter() throws {
    let app = XCUIApplication()
    app.launch()

    app.tabBars.buttons["Debug"].tap()
    let openButton = app.buttons["debug.openNativeDemo"]
    XCTAssertTrue(openButton.waitForExistence(timeout: 5))
    openButton.tap()

    let nativeDemo = app.otherElements["screen.nativeDemo"]
    XCTAssertTrue(nativeDemo.waitForExistence(timeout: 5))

    let counter = app.staticTexts["nativeDemo.counter"]
    XCTAssertEqual(counter.label, "0")

    app.buttons["nativeDemo.incrementButton"].tap()
    app.buttons["nativeDemo.incrementButton"].tap()
    XCTAssertEqual(counter.label, "2")

    app.buttons["nativeDemo.closeButton"].tap()
    XCTAssertFalse(nativeDemo.exists)
  }
}
