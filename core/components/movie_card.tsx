import { YtsMovie } from "types";

export default function MovieCard({
	movie: { large_cover_image: cover },
	onClick,
	}: { movie: YtsMovie, onClick: () => void }) {
	return <div style={{
		margin: '8px',
		borderRadius: '4px',
		overflow: 'hidden',
	}} onClick={onClick}>
		<img src={cover} alt="Movie Cover Image" height={300} />
	</div>
}
