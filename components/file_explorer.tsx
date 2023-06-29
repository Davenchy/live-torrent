import { usePath } from "core/hooks/path"
import useTorrentInfo from "core/hooks/torrent"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TorrentFileInfo } from "types"

export interface FileExplorerProps {
	infohash: string
	path?: string
}

function getDirs(path: string, files: TorrentFileInfo[]): string[] {
	const dirs: string[] = []
	const len = path.length

	for (const file of files) {
		if (!file.path.startsWith(path))
			continue
		const spath = file.path.substring(len).split('/').filter(n => n)
		if (spath.length <= 1)
			continue
		if (dirs.indexOf(spath[0]) == -1)
			dirs.push(spath[0])
	}

	return dirs
}

function getFiles(path: string, files: TorrentFileInfo[]): TorrentFileInfo[] {
	return files.filter((f: TorrentFileInfo) => f.path === `${path}/${f.name}`)
}

function File({
	file, infohash
	}: {
		file: TorrentFileInfo,
		infohash: string,
}) {

	return <li>
		<a href={`/api/torrent/${infohash}${file.path}`}>
			{file.name}</a>
		<span className="m-4">
			{Math.round(file.downloaded / file.size * 100)}%</span>
		{
			file.type.startsWith('video')
				? <a
					href={`/player/${infohash}${file.path}`}
					className="px-2 py-1 bg-blue-500 text-white rounded-lg">watch</a>
				: null
		}
	</li>
}

function Directory({ name, onClick }: { name: string, onClick: () => void }) {
	return <li
		className="cursor-pointer underline font-bold"
		onClick={onClick}
		>{name}/</li>
}

export default function FileExplorer({
	infohash, path: initPath
	}: FileExplorerProps) {
	const { torrent, error, isLoading } = useTorrentInfo(infohash)
	const {path, open, back} = usePath(initPath)
	const [dirs, setDirs] = useState<string[]>([])
	const [files, setFiles] = useState<TorrentFileInfo[]>([])
	const router = useRouter()

	useEffect(() => {
		setDirs(torrent ? getDirs(path, torrent.files) : [])
		setFiles(torrent ? getFiles(path, torrent.files) : [])
	}, [path, torrent])

	const watchVideo = (path: string) =>
		router.push(`/player/${infohash}${path}`)

	if (isLoading) return <div>Loading...</div>
	if (error || !torrent) return <div>Failed to fetch torrent files!</div>

	return <div>
		<h2 className="text-xl text-gray-600">Path: {path}</h2>
		<div className="ml-8 mt-4">
			<ul>
				{
					/* the back button */
					path !== '/' ? <Directory onClick={back} name={'..'} /> : null
				}
				{
					/* the directories */
					dirs.map(
						name => <Directory
							key={path + '/' + name}
							name={name}
							onClick={() => open(name)} />
					)
				}
				{
					/* the files */
					files.map(file =>
						<File
							key={file.path}
							file={file}
							infohash={infohash} />)
				}
			</ul>
		</div>
	</div>
}
