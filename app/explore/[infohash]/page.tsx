"use client"
import FileExplorer from 'components/file_explorer'
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
		return <div
		className="container mx-auto flex flex-col justify-center
		place-items-center h-screen">
				<h1 className="text-6xl font-bold text-blue-400 mb-16">Loading...</h1>
				<p className="text-xl">Fetching data with infohash: {params.infohash}</p>		
			</div>

	if (error || !torrent)
		return <div
		className="container mx-auto flex flex-col justify-center
		place-items-center h-screen">
				<h1 className="text-6xl font-bold text-red-500 mb-16">Error!</h1>
				<p className="text-xl">Failed to fetch info: {params.infohash}</p>
				<Link
			href='/'
			className="text-white bg-blue-600 px-4 py-2 mt-6 rounded">Home</Link>
			</div>

	return <div className="container mx-auto my-16 flex flex-col">
			<div className="flex gap-x-4 mb-8">
				<Link
				href='/'
				className="p-2 px-3 font-bold text-blue-600 border-2 border-blue-600
				rounded-full hover:text-white hover:bg-blue-600"
				>&lt;</Link>
				<h1 className="text-3xl">{torrent.name}</h1>
			</div>
			<FileExplorer infohash={params.infohash} />
		</div>
}
