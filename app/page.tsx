"use client"
import Movies from 'core/components/movies'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useState } from 'react'

export default function Home() {
	const [torrentId, setTorrentId] = useState("")
	const router = useRouter()

	const updateTorrentId = (e: ChangeEvent<HTMLInputElement>) =>
		setTorrentId(e.target.value)
	const explore = (infohash: string) => router.push(`/explore/${infohash}`)
	const exploreSintel = () => 
		explore("08ada5a7a6183aae1e09d831df6748d566095a10")

	return <div>
		<input
			placeholder="TorrentId"
			value={torrentId}
			onChange={updateTorrentId} />
		<button onClick={() => explore(torrentId)}>Explore</button>
		<button onClick={exploreSintel}>Explore Sintel Example</button>
		<hr />
		<Movies />
	</div>
}
