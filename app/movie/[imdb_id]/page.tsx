"use client"
import { useMovie } from "core/hooks/yts"
import { calculateAvailability, formatSize, formatTime } from "core/utils/quick_formaters"
import Link from "next/link"
import { CSSProperties } from "react"
import { YtsTorrent } from "types"

type MoviePageProps = {
	params: {
		imdb_id: string
	}
}

const style: CSSProperties = {
	margin: '40px 10lvw'
}

function TorrentCard({
	torrent: { type, quality, size_bytes, seeds, peers, hash }
	}: { torrent: YtsTorrent }) {
	return <li>
		<h3>{type}.{quality} - {formatSize(size_bytes)} - {calculateAvailability(seeds, peers)}</h3>
		<p>{hash}</p>
		<Link href={`/explore/${hash}`}>Explore</Link>
	</li>
}

export default function MoviePage({
	params: { imdb_id }
}: MoviePageProps) {
	const {movie, error, isLoading} = useMovie(imdb_id)

	if (isLoading)
		return <p>Loading your movie...</p>
	if (error || !movie || !movie.id)
		return <p>Error: Failed to fetch movie with imdb id: {imdb_id}</p>

	return <div style={style}>
		<img src={movie.large_cover_image} alt={movie.title} width='200lvw' />
		<hr />
		<span>Rate: {movie.rating}</span> -&nbsp;
		<span>Language: {movie.language}</span> -&nbsp;
		<span>Runtime: {formatTime(movie.runtime * 60)}</span> -&nbsp;
		<span>Categories: {movie.genres.join(', ')}</span>
		<hr />
		<h1>{movie.title} ({movie.year})</h1>
		<p>{movie.description_full}</p>

		<h2>Torrents:</h2>
		<ul>
		{movie.torrents.map(t => <TorrentCard key={t.hash} torrent={t}/>)}
		</ul>
	</div>
}
