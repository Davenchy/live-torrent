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
