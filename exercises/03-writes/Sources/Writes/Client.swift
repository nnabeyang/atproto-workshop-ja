import Foundation
import SwiftAtproto

#if canImport(FoundationNetworking)
  import FoundationNetworking
#endif

/// Calls XRPC methods on one service, as a logged-in account if it has a token.
struct Client: XRPCCallable {
  let service: URL
  /// The access token sent with each call, once logged in.
  var accessJwt: String?

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
    var request = URLRequest(url: components.url!)
    request.httpMethod = requestComponents.method.rawValue
    request.httpBody = requestComponents.body
    for field in requestComponents.headers {
      request.setValue(field.value, forHTTPHeaderField: field.name.rawName)
    }
    if let accessJwt {
      request.setValue("Bearer \(accessJwt)", forHTTPHeaderField: "Authorization")
    }

    let (data, response) = try await URLSession.shared.data(for: request)
    let statusCode = (response as? HTTPURLResponse)?.statusCode ?? 0
    guard 200..<300 ~= statusCode else {
      throw (try? JSONDecoder().decode(UnExpectedError.self, from: data))
        ?? UnExpectedError(error: nil, message: "HTTP \(statusCode)")
    }
    return data
  }
}
