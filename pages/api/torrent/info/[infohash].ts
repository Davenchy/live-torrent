import { requestTorrent, torrentToJson } from "core/utils/torrent/help_functions"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	let infohash: string = req.query['infohash'] as string
	const torrent = await requestTorrent(infohash)
	res.json(torrentToJson(torrent))
}
