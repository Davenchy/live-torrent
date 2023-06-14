import { requestTorrent, streamFile } from "core/utils/torrent/help_functions"
import { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const infohash: string = req.query['infohash'] as string
	const path: string = (req.query['path'] as string[]).join('/')

	requestTorrent(infohash)
		.then(torrent => {
			const file = torrent.files.filter(f => f.path === path)[0]
			streamFile(file, req, res)
		})
		.catch(_ => res.status(400).json({error: 'failed to fetch torrent'}))
}
