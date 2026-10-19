import Foundation
import SwiftAtproto

#if canImport(FoundationNetworking)
  import FoundationNetworking
#endif

/// Calls XRPC methods on one service without logging in.
struct Client: XRPCCallable {
  let service: URL

  init(_ service: String) {
    self.service = URL(string: service)!
  }

  func getProxy(nsid: String) -> String? { nil }

  func response(_ requestComponents: XRPCRequestComponents) async throws -> Data {
    var components = URLComponents(
      url: service.appending(path: requestComponents.relativePath), resolvingAgainstBaseURL: false)!
    if !requestComponents.queryItems.isEmpty {
      components.percentEncodedQueryItems = requestComponents.queryItems
    }
    let (data, response) = try await URLSession.shared.data(from: components.url!)
    let statusCode = (response as? HTTPURLResponse)?.statusCode ?? 0
    guard 200..<300 ~= statusCode else {
      throw (try? JSONDecoder().decode(UnExpectedError.self, from: data))
        ?? UnExpectedError(error: nil, message: "HTTP \(statusCode)")
    }
    return data
  }
}
