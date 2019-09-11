# live-torrent

Search, explore and download torrent files online.

the backend package is [live-torrent-backend](https://github.com/Davenchy/live-torrent-backend)

## Frontend API

| Path      | query                              | description                                                                                                                                         |
| --------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| /         | [query]                            | quick way to add torrentId and explore it                                                                                                           |
| /movies   | [query, limit, rating, genre]      | search movies                                                                                                                                       |
| /search   | [query, limit, category, provider] | providers: [all, 1337x, ExtraTorrent, KickassTorrents, Rarbg, ThePirateBay], the most used categories: [All, Movies, TV, Music, Apps, Anime, Books] |
| /explorer | torrentId                          | explore torrent file using its torrent id (http/https torrent file or info hash or magnet uri)                                                      |
| /player   | torrentId, fileIndex, [caption]    | play video or audio file using torrentId and the file index, find more about captions below                                                         |
