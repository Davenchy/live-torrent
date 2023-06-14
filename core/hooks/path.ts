import { useState } from "react";

export function usePath(initPath?: string) {
	const [path, setPath] = useState<string>(initPath ?? "/")

	const open = (dirname: string) =>
		setPath('/' + [...path.split('/').filter(n => n), dirname])
	const back = () => {
		const spath = path.split('/').filter(n => n)
		spath.pop()
		setPath('/' + spath.join('/'))
	}

	return {
		path,
		setPath,
		open,
		back,
	}
}
