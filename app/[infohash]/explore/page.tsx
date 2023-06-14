"use client"
import FileExplorer from 'core/components/file_explorer'
import useTorrentInfo from 'core/hooks/torrent'
import Link from 'next/link'

interface ExplorerPageParams {
	infohash: string
}

export default function ExplorerPage({
	params
}: { params: ExplorerPageParams }) {
	const {torrent, error, isLoading} = useTorrentInfo(params.infohash)

	if (isLoading)
		return <div>Loading({params.infohash})...</div>

	if (error || !torrent)
		return <div>
				<h3 style={{color: 'red'}}>Error!</h3>
				<p>Failed to fetch info: {params.infohash}</p>
			</div>

	return <div>
			<div>
				<Link href={'/'}>&lt;</Link>
				<h1>{torrent.name}</h1>
			</div>
			<FileExplorer infohash={params.infohash} />
		</div>
}
