/** torrent file in form of json object */
export interface TorrentFileInfo {
	/** the name of the file including the extension */
	name: string
	/** the full path of the file inside the torrent files tree */
	path: string
	/** the mime type of the file */
	type: string
	/** the file size in bytes */
	size: number
	/** the number of downloaded bytes */
	downloaded: number
}

/** torrent file info in form of json object */
export interface TorrentInfo {
	/** the torrent name */
	name: string
	/** the torrent info hash */
	infoHash: string
	/** number of the peers sharing the torrent file content */
	peers: number
	/** the total files size in bytes */
	size: number
	/** the total downloaded bytes */
	downloaded: number
	/** list of files in the torrent */
	files: TorrentFileInfo[]
}

export interface YtsResponse<T> {
	status: string
	status_message: string
	data: T
}

export interface YtsSearchResult {
	movie_count: number
	limit: number
	page_number: number
	movies: YtsMovie[]
}

export interface YtsMovie {
	id: number
	url: string
	imdb_code: string
	title: string
	slug: string
	year: number
	rating: number
	runtime: number
	language: string
	genres: string[]
	summary: string
	description_full: string
	background_image: string
	small_cover_image: string
	large_cover_image: string
	torrents: YtsTorrent[]
}

export type YtsTorrentQuality = "480p" | "720p" | "1080p" | "2160p" | "3D"
export type YtsTorrentType = "web" | "bluray"

export interface YtsTorrent {
	hash: string
	quality: YtsTorrentQuality
	size: number
	type: YtsTorrentType
	seeds: number
	peers: number
}
