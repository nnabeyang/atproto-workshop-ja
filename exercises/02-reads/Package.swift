// swift-tools-version: 6.4

import PackageDescription

let package = Package(
  name: "reads",
  platforms: [.macOS(.v14)],
  dependencies: [
    .package(url: "https://github.com/nnabeyang/swift-atproto.git", from: "0.44.5")
  ],
  targets: [
    .executableTarget(
      name: "reads",
      dependencies: [
        .product(name: "SwiftAtproto", package: "swift-atproto")
      ],
      path: "Sources/Reads"
    )
  ]
)
