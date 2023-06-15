type uv = { u: string, v: number }

export const formatTime = (seconds: number): string => {
	const units: uv[] = [
		{u: 'd', v: 86400},
		{u: 'h', v: 3600},
		{u: 'm', v: 60},
		{u: 's', v: 1},
	]
	const values: string[] = []

	for (const { u, v } of units) {
		if (seconds < v)
			continue
		values.push(`${Math.floor(seconds / v)}${u}`)
		seconds %= v
	}

	return values.join(' ')
}

export const formatSize = (bytes: number): string => {
	const units: string[] = ['B', 'KB', 'MB', 'GB', 'TB']
	let index = 0

	while (bytes >= 1024 && index < units.length) {
		bytes /= 1024
		index++
	}
	return `${bytes.toFixed(2)}${units[index]}`
}

export const calculateAvailability =
	(seeders: number, leechers: number): string =>
	!seeders
		? "0.00%"
		: Math.min(Math.abs(1 - leechers/seeders), 1).toFixed(2) + '%'
