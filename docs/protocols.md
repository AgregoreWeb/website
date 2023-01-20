## Supported Protocols - Agregore Browser

Information about the supported protocols within Agregore and their functionality

- ☑️ [BitTorrent](http://www.bittorrent.org/index.html) (`bittorrent://` and `magnet:`) [source](https://github.com/RangerMauve/bt-fetch/)
	- Able to view contents of torrents
  - Stream video and image data
  - Translate `magnet:` URIs to `bittorrent:` URLs
  - Resolve mutable torrents
- ☑️ [Hypercore](https://hypercore-protocol.org/) (`hyper://`) [source](https://github.com/RangerMauve/hypercore-fetch)
  - Able to read from archives
  - Able to resolve `hyper-dns` domains
  - Able to write, create and modify archives
- ☑️ [Gemini](https://gemini.circumlunar.space/) (`gemini://`) [source](https://github.com/RangerMauve/gemini-fetch)
  - Able to read from gemini servers
  - Render Gemini pages as HTMLs
  - No certificate management code yet
- ☑️ [IPFS](https://ipfs.io/) (`ipfs://` and `ipns://`) [source](https://github.com/RangerMauve/js-ipfs-fetch)
  - Able to read from IPFS CIDs, IPLD public keys, and IPLD DNSLink domains.
  - Able to `POST` data into IPFS
  - Able to `POST` data into IPNS
- ☑️ [GUN](https://gun.eco) (`gun://`) [source](https://github.com/resession/gun-fetch)
  - Able to load data from GUN
  - Able to `PUT` data into GUN
  - Able to use GUN accounts
- ☑️ [SecureScuttlebutt](https://scuttlebutt.nz) (`ssb://`) [source](https://github.com/av8ta/ssb-fetch/)
  - Connect to existing running SSB node
  - Able to load `ssb:` URLs (messages, blobs)
  - Translate cipherlinks to `ssb:` URLs
  - (soon) POST to SSB?

### Coming soon

Here are some protocols we'd like to add, but haven't had the time to yet. Feel free to open a GitHub issue if you'd like to tackle them!

- [EarthStar](https://github.com/earthstar-project/earthstar)
- [Gopher Protocol](https://en.wikipedia.org/wiki/Gopher_(protocol))
- [Pigeon Protocol](https://github.com/PigeonProtocolConsortium/pigeon-spec)

PRs for more protocols are welcome.

---

[Back](/)
