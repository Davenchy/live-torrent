import { useEffect, useReducer } from "react"
import useSWR from "swr"
import { YtsMovie, YtsMovieResult, YtsResponse, YtsSearchResult } from "types"

interface MoviesAction {
	type: 'reset' | 'search' | 'error' | 'data' | 'next'
	query?: string
	page?: number
	error?: string
	data?: YtsSearchResult
}

export type MoviesState = {
	state: "init" | "loading" | "data" | "error",
	query: string,
	error: string|undefined,
	movies: YtsMovie[]|undefined,
	page: number,
	pages: number,
}

const initState: MoviesState = {
	state: 'init',
	query: '',
	error: undefined,
	movies: undefined,
	page: 0,
	pages: 0,
}

const moviesReducer = (state: MoviesState, action: MoviesAction): MoviesState => {
	switch (action.type) {
		case 'reset':
			return initState
		case 'search':
			return {
				...initState,
				state: 'loading',
				query: action.query || '',
				page: 1,
		}
		case 'next':
			if (state.page >= state.pages
				|| state.state !== 'data')
				return state
			return {
				...state,
				state: 'loading',
				query: state.query || '',
				page: state.page + 1,
			}
		case 'error':
			return { ...initState, error: action.error, state: 'error' }
		case 'data':
			if (!action.data)
				return state
			const { movies: ms, page_number, limit, movie_count } = action.data
			var movies: YtsMovie[]|undefined;
			if (!!ms && !!ms.length)
				movies = [
					...(state.movies || []),
					...(ms ?? [])
				]
			return {
				...state,
				movies,
				state: 'data',
				page: page_number,
				pages: Math.ceil(movie_count / limit),
			}
		default:
			return state
	}
}

const fetcher = <T> (url: string) =>
	fetch(`https://yts.mx/api/v2/${url}`)
		.then(res => res.ok ? res.json() as Promise<YtsResponse<T>> : undefined)

export function useMovies() {
	const [state, dispatch] = useReducer(moviesReducer, initState)

	useEffect(() => {
		if (state.state !== 'loading')
			return;

		fetcher<YtsSearchResult>(
			`list_movies.json?query_term=${state.query}&page=${state.page}`)
			.then(res => {
				if (res?.status !== "ok")
					return
				if (!res.data)
					throw new Error()
				dispatch({ type: 'data', data: res.data })
			})
			.catch(() => dispatch({type: 'error', error: 'Failed to fetch movies'}))
	}, [state])

	const reset = () => dispatch({type: 'reset'})
	const search = (query: string) => dispatch({ type: 'search', query })
	const loadMore = () => dispatch({ type: 'next' })

	return {
		state,
		search,
		reset,
		loadMore,
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
