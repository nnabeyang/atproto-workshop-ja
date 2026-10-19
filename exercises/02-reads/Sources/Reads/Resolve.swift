import Foundation
import SwiftAtproto

#if canImport(FoundationNetworking)
  import FoundationNetworking
#endif

/// Finds the PDS that hosts an account's repository.
///
/// A handle resolves to a DID, and the DID document names the PDS.
func resolvePDS(_ actor: String, appview: Client) async throws -> Client {
  // 1. Handle → DID. A DID is used as it is.
  let did: String
  if actor.hasPrefix("did:") {
    did = actor
  } else {
    did = try await appview.IdentityResolveHandle(handle: .init(rawValue: actor)).did.rawValue
  }

  // 2. DID → DID document, from the PLC directory or, for did:web, from the domain itself.
  let documentURL: URL
  if did.hasPrefix("did:web:") {
    documentURL = URL(string: "https://\(did.dropFirst("did:web:".count))/.well-known/did.json")!
  } else {
    documentURL = URL(string: "https://plc.directory/\(did)")!
  }
  let (data, _) = try await URLSession.shared.data(from: documentURL)
  let document = try JSONDecoder().decode(DIDDocument.self, from: data)

  // 3. DID document → PDS.
  guard let pds = document.service?.first(where: { $0.id.hasSuffix("#atproto_pds") }) else {
    throw URLError(.cannotFindHost)
  }
  return Client(pds.serviceEndpoint)
}
