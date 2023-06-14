import {
	requestTorrent, torrentToJson
} from "core/utils/torrent/help_functions"
import { NextApiRequest, NextApiResponse } from "next"

export default function handler(
	req: NextApiRequest, res: NextApiResponse
) {
	let infohash: string = req.query['infohash'] as string
	requestTorrent(infohash)
		.then(torrent => res.json(torrentToJson(torrent)))
		.catch(_ => res.status(400).json({error: 'failed to fetch torrent'}))
}
