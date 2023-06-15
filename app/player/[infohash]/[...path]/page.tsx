"use client"

export default function VideoPlayer({ params: { infohash, path } }) {
	return <div>
		<h4>Player: {infohash}:/{path.join('/')}</h4>
		<video src={`/api/torrent/${infohash}/${path.join('/')}`} controls />
	</div>
}
