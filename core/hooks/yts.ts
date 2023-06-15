import { useEffect, useState } from "react"
import useSWR from "swr"
import { YtsMovie, YtsMovieResult, YtsResponse, YtsSearchResult } from "types"

const fetcher = <T> (url: string) =>
	fetch(`https://yts.mx/api/v2/${url}`)
		.then(res => res.ok ? res.json() as Promise<YtsResponse<T>> : undefined)

export function useMovies() {
	const [ page, setPage ] = useState(1)
	const [ query, setQuery ] = useState<string>("")
	const [ isLoading, setIsLoading ] = useState<boolean>(false)
	const [ error, setError ] = useState<string|undefined>(undefined)
	const [ movies, setMovies ] = useState<YtsMovie[]>([])

	useEffect(() => {
		if (!isLoading)
			return;

		fetcher<YtsSearchResult>(
			`list_movies.json?query_term=${query}&page=${page}`)
			.then(res => {
				if (res?.status !== "ok")
					return
				setMovies(movies => [...movies, ...(res.data?.movies ?? [])])
			})
			.catch(() => setError("Failed to fetch movies"))
			.finally(() => setIsLoading(false))
	}, [isLoading])

	const search = (keyward: string) => {
		setQuery(keyward)
		setPage(1)
		setError(undefined)
		setMovies([])
		setIsLoading(true)
	}

	const reload = () => search(query)

	const loadMore = () => {
		setError(undefined)
		setPage(p => p + 1)
		setIsLoading(true)
	}

	return {
		movies,
		isLoading,
		error,
		reload,
		loadMore,
		search,
	}
}

export function useMovie(id: string) {
	const {data, isLoading, error} = useSWR(`movie_details.json?imdb_id=${id}`,
		fetcher<YtsMovieResult>)

	return {
		movie: data?.data.movie,
		isLoading,
		error,
	}
}
