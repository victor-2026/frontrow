import UIKit

/// FrontRow Native Demo — a hand-rolled UIViewController wrapped by a
/// RCTBridgeModule so it can be presented from the React Native shell.
///
/// The whole point of this screen is to give XCUITest an *authentic* native
/// target: every element below is a UIKit view with an explicit
/// `accessibilityIdentifier`, so test code can address them with the same
/// pattern as the JS-driven screens (`app.buttons["nativeDemo.closeButton"]`).
///
/// To wire this into the live app, see native-showcase/README.md.
@objc(FrontRowNativeDemoViewController)
public final class FrontRowNativeDemoViewController: UIViewController {
  // MARK: - Lifecycle

  override public func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = .systemBackground
    view.accessibilityIdentifier = "screen.nativeDemo"

    let title = UILabel()
    title.text = "Native Demo"
    title.font = .preferredFont(forTextStyle: .largeTitle)
    title.adjustsFontForContentSizeCategory = true
    title.translatesAutoresizingMaskIntoConstraints = false
    title.accessibilityIdentifier = "nativeDemo.title"
    view.addSubview(title)

    let subtitle = UILabel()
    subtitle.text =
      "This screen is a hand-built UIViewController, not a React Native component. " +
      "XCUITest can drive it directly — the testIDs map to accessibilityIdentifier."
    subtitle.font = .preferredFont(forTextStyle: .body)
    subtitle.numberOfLines = 0
    subtitle.translatesAutoresizingMaskIntoConstraints = false
    subtitle.accessibilityIdentifier = "nativeDemo.body"
    view.addSubview(subtitle)

    let counterLabel = UILabel()
    counterLabel.text = "0"
    counterLabel.font = .preferredFont(forTextStyle: .title1)
    counterLabel.textAlignment = .center
    counterLabel.translatesAutoresizingMaskIntoConstraints = false
    counterLabel.accessibilityIdentifier = "nativeDemo.counter"
    self.counter = counterLabel
    view.addSubview(counterLabel)

    let increment = UIButton(type: .system)
    increment.setTitle("Increment", for: .normal)
    increment.titleLabel?.font = .preferredFont(forTextStyle: .headline)
    increment.translatesAutoresizingMaskIntoConstraints = false
    increment.accessibilityIdentifier = "nativeDemo.incrementButton"
    increment.addTarget(self, action: #selector(onIncrement), for: .touchUpInside)
    view.addSubview(increment)

    let close = UIButton(type: .system)
    close.setTitle("Close", for: .normal)
    close.translatesAutoresizingMaskIntoConstraints = false
    close.accessibilityIdentifier = "nativeDemo.closeButton"
    close.addTarget(self, action: #selector(onClose), for: .touchUpInside)
    view.addSubview(close)

    NSLayoutConstraint.activate([
      title.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 24),
      title.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
      title.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
      subtitle.topAnchor.constraint(equalTo: title.bottomAnchor, constant: 12),
      subtitle.leadingAnchor.constraint(equalTo: title.leadingAnchor),
      subtitle.trailingAnchor.constraint(equalTo: title.trailingAnchor),
      counterLabel.topAnchor.constraint(equalTo: subtitle.bottomAnchor, constant: 32),
      counterLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
      increment.topAnchor.constraint(equalTo: counterLabel.bottomAnchor, constant: 12),
      increment.centerXAnchor.constraint(equalTo: view.centerXAnchor),
      close.bottomAnchor.constraint(
        equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -16),
      close.centerXAnchor.constraint(equalTo: view.centerXAnchor),
    ])
  }

  // MARK: - Actions

  @objc private func onIncrement() {
    count += 1
    counter?.text = String(count)
  }

  @objc private func onClose() {
    dismiss(animated: true)
  }

  // MARK: - State

  private var count = 0
  private var counter: UILabel?
}
