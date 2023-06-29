import { useMovies } from "core/hooks/yts";
import MovieCard from "./movie_card";
import { useEffect, useMemo } from "react";

const searchInfoTW = 'text-xl font-bold m-24'

function debounce(callback: Function, delay: number) {
	let timer: NodeJS.Timeout;
	return function(...args: unknown[]) {
		if (timer)
			clearTimeout(timer)
		timer = setTimeout(() => {
			callback(...args)
		}, delay)
	}
}

export default function Movies({ query }: { query: string }) {
	const { search, loadMore, state } = useMovies()
	const dsearch = useMemo(() => debounce((q: string) => search(q), 600), [])
	const isLoading = state.state === 'loading'
	const hasMovies = state.state === 'data' && !!state.movies && !!state.movies.length
	const hasMore = state.page < state.pages
	const movies = state.movies

	useEffect(() => {
		dsearch(query)
	}, [query])

	useEffect(() => {
		loadMore()
		const scrollHandler = () => {
			const scroll = window.document.scrollingElement
			const threshold = window.innerHeight * 1.2
			if (!scroll)
				return
			const { scrollTop, scrollHeight } = scroll
			if (scrollTop + threshold >= scrollHeight)
				loadMore()
		}

		addEventListener('scroll', scrollHandler)
		return () => removeEventListener('scroll', scrollHandler)
	}, [])

	return <div className="container mx-auto flex flex-col items-center">
		<div className="w-full grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6
			place-items-center">
			{
				movies !== undefined
					? movies.map((movie, i) =>
						<a
							href={`/movie/${movie.imdb_code}`}
							key={movie.id + movie.imdb_code + i}>
								<MovieCard movie={movie} />
						</a>
					)
					: null
			}
		</div>
		{isLoading && <p className={searchInfoTW}>Loading...</p>}
		{
			!isLoading
				&& hasMovies
				&& !hasMore
				&& <p className={searchInfoTW}>No More Results</p>
		}
		{
			!isLoading
				&& !hasMovies
				&& <p className={searchInfoTW}>No results found for {query}</p>
		}
	</div>
}
