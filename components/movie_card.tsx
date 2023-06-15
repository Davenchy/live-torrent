import { YtsMovie } from "types";

export default function MovieCard({
	movie: { large_cover_image: cover, title },
	onClick,
	}: { movie: YtsMovie, onClick: () => void }) {
	return <div style={{
		margin: '8px',
		borderRadius: '4px',
		overflow: 'hidden',
		cursor: 'pointer',
	}} onClick={onClick}>
		<img src={cover} width={200} alt="Movie Cover Image" />
	</div>
}
