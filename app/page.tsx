"use client"
import Movies from 'components/movies';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FormEvent, useState } from 'react'

const twConfig = {
	full: {
		form: 'h-screen flex flex-col justify-center place-items-center',
		logo: 'mb-24 text-6xl',
		input: 'w-1/2 mb-6 p-2 rounded',
		button: 'py-2 px-4',
	},
	oneline: {
		form: 'h-16 p-4 flex items-center gap-x-4',
		logo: 'text-xl',
		input: 'w-1/3 px-2 py-1 rounded',
		button: 'py-1 px-4',
	},
}

export default function Home() {
	const router = useRouter()
	const sp = useSearchParams()
	const q: string|null|undefined = (sp?.has("q") ?? false)
		? sp?.get('q')
		: undefined;
	const showMovies = q !== undefined;
	const [query, setQuery] = useState(q || "")
	const mode = showMovies ? twConfig.oneline : twConfig.full

	const whichPath = () => {
		var len = query.trim().length
		return len === 40 ? '/explore/' + query : '/?q=' + query
	}

	const submit = (e: FormEvent) => {
		if (query.trim().length === 40)
			router.push("/explore/"+query)
		else
			router.push("/?q="+query)
		e.preventDefault()
	}

	return <div>
		<form className={`${mode.form} container mx-auto`}
			onSubmit={submit}>			
			<Link href="/"
				className={`text-blue-600 font-black ${mode.logo}`}>	
				Live Torrent V4
			</Link>
			<input
				placeholder='MovieName, MovieId, Infohash...'
				className={mode.input}
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				autoFocus />
			<div className='gap-x-4 flex'>
				<Link
					className={`${mode.button} bg-blue-600 text-white rounded-md
					hover:bg-blue-800`}
					href={whichPath()}>Search</Link>
				<Link
					className={`${mode.button} text-blue-600
					border-2 border-blue-600 rounded-md
					hover:bg-blue-800 hover:text-white`}
					href='/explore/08ada5a7a6183aae1e09d831df6748d566095a10'>
					Explore Sintel Example
				</Link>
			</div>
		</form>
		{ showMovies && <hr /> }
		{ showMovies && <Movies query={query} /> }
	</div>
}
