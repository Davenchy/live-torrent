import useSWR from "swr"
import { TorrentInfo } from "types"

const fetcher = async (url: string) =>
	fetch(url).then(res => res.ok ? res.json() : undefined)

export default function useTorrentInfo(infohash: string) {
	const {data, error, isLoading} = useSWR(`/api/torrent/${infohash}`, fetcher)
	return {
		torrent: data,
		error,
		isLoading
	} as {
			torrent: TorrentInfo|undefined,
			error: string|undefined,
			isLoading: boolean
	}
}
