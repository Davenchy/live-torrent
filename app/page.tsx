"use client"
import React, { ChangeEvent, useState } from 'react'
import { TorrentFileInfo, TorrentInfo } from 'types'

function FilesBrowser({
	infohash, files
	}: { infohash: string, files: TorrentFileInfo[] }) {
	return <div>
		{files
		.map((f, i) => <div>
			<a key={`${i}${f.path}`} href={`/api/torrent/${infohash}/${f.path}`}>
					{f.name}
				</a>
			</div>)}
		</div>
}

export default function Home() {
	const [torrentId, setTorrentId] = useState("")
	const [error, setError] = useState("")
	const [data, setData] = useState<TorrentInfo|undefined>(undefined)
	const [isLoading, setIsLoading] = useState(false)

	const updateTorrentId = (e: ChangeEvent<HTMLInputElement>) =>
		setTorrentId(e.target.value)
	const fetchTorrentData = () => {
		setIsLoading(true)
		setData(undefined)
		setError("")
		fetch(`/api/torrent/${torrentId}`).then(res => {
			if (res.ok)
				return res.json()
		})
			.then(torrent => setData(torrent))
			.catch(err => setError("bad"))
			.finally(() => setIsLoading(false))
	}
	const autoFetch = () => {
		setTorrentId("08ada5a7a6183aae1e09d831df6748d566095a10")
		fetchTorrentData()
	}


	return (<div>
		<input
			placeholder="TorrentId"
			value={torrentId}
			onChange={updateTorrentId} />
		<button onClick={fetchTorrentData} disabled={isLoading}>Fetch</button>
		<button onClick={autoFetch} disabled={isLoading}>Auto Fetch</button>
		{error ? <span style={{color: 'red'}}>{error}</span> : null}
		<hr />
		<span style={{ display: isLoading ? 'block' : 'none' }}>Loading...</span>
		{
			!isLoading && data ? (
				<div>
					Torrent Name: {data.name}<br />
					Downloads: {(data.downloaded / data.size).toFixed(0)}%<br />
					<FilesBrowser infohash={data.infoHash} files={data?.files?? []} />
				</div>
			) : null
		}
	</div>)
}
