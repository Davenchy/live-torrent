import { useMovies } from "core/hooks/yts";
import MovieCard from "./movie_card";
import { CSSProperties, ChangeEvent, useEffect, useState } from "react";
import { YtsMovie } from "types";
import { useRouter } from "next/navigation";

const moviesListStyle: CSSProperties = {
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center'
}

export default function Movies() {
	const router = useRouter()
	const [ query, setQuery ] = useState("")
	const { movies, isLoading, loadMore, search } = useMovies()

	useEffect(() => {
		loadMore()
		const scrollHandler = () => {
			const scroll = window.document.scrollingElement
			const threshold = window.innerHeight * 1.2
			if (!scroll)
				return
			const { scrollTop, scrollHeight } = scroll
			console.log("height:", window.innerHeight)
			console.log(scrollTop, scrollHeight)
			if (scrollTop + threshold >= scrollHeight)
				loadMore()
		}

		addEventListener('scroll', scrollHandler)
		return () => removeEventListener('scroll', scrollHandler)
	}, [])

	const updateQuery = (e: ChangeEvent<HTMLInputElement>) =>
		setQuery(e.target.value)

	const openMovie = (movie: YtsMovie) => router.push(`/movie/${movie.slug}`)

	return <div>
		<h1>Movies</h1>
		<input
			type="search"
			placeholder="Search for a movie..."
			value={query}
			onChange={updateQuery} />
		<button onClick={() => search(query)}>Search</button>
		<br /><br /><br />
		<div style={moviesListStyle}>
			{
				movies.length
				? movies.map(movie =>
						<MovieCard
							key={movie.id}
							movie={movie}
							onClick={() => openMovie(movie)} />
					)
				: null
			}
		</div>
		<br />
		{isLoading && <p>Loading...</p>}
		<br />
	</div>
}
