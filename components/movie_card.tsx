import { YtsMovie } from "types";

export default function MovieCard({
	movie: { large_cover_image: cover },
	}: { movie: YtsMovie }) {
	return <div style={{
		margin: '8px',
		borderRadius: '4px',
		overflow: 'hidden',
		cursor: 'pointer',
	}}>
		<img src={cover} width={200} alt="Movie Cover Image" />
	</div>
}
