# Supported Protocols - Agregore Browser

Information about the supported protocols within Agregore and their functionality

- ☑️ [BitTorrent](http://www.bittorrent.org/index.html) (`bittorrent://` and `magnet:`)
	- Able to view contents of torrents
  - Stream video and image data
  - Translate `magnet:` URIs to `bittorrent:` URLs
  - Resolve mutable torrents
- ☑️ [Hypercore](https://hypercore-protocol.org/) (`hyper://`)
  - Able to read from archives
  - Able to resolve `hyper-dns` domains
  - Able to write, create and modify archives
- ☑️ [Gemini](https://gemini.circumlunar.space/) (`gemini://`)
  - Able to read from gemini servers
  - Render Gemini pages as HTMLs
  - No certificate management code yet
- ☑️ [IPFS](https://ipfs.io/) (`ipfs`)
  - Able to read from `ipfs://` and `ipns://` URLs
  - Able to `POST` data into IPFS
  - Able to `POST` data into IPNS

## Coming soon

Here's some protocol we'd like to add, but haven't had time yet. Feel free to open a GitHub issue if you'd like to tackle them!

- [EarthStar](https://github.com/earthstar-project/earthstar)
- [Pigeon Protocol](https://github.com/PigeonProtocolConsortium/pigeon-spec)
- [Gopher Protocol](https://en.wikipedia.org/wiki/Gopher_(protocol))

PRs for more protocols are welcome.

---

[Home](/)
