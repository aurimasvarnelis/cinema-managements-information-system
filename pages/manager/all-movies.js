import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { getGenres, getMovies, getRatings } from "../../controllers/movieController";

import { AddMovie } from "../../components/manager/all-movies/AddMovie";
import { DeleteMovie } from "../../components/manager/all-movies/DeleteMovie";
import { EditMovie } from "../../components/manager/all-movies/EditMovie";
import { ViewMovie } from "../../components/manager/all-movies/ViewMovie";
import dbConnect from "../../lib/dbConnect";

export default function movies({ movies, genres, ratings }) {
	return (
		<>
			<Container>
				<AddMovie genres={genres} ratings={ratings} />

				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Poster</th>
							<th>Name</th>
							<th>Premiere date</th>
							<th>Genre</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{movies.map((movie) => (
							<tr key={movie._id} className="item-row">
								<td>
									<embed src={movie.poster} height="100px"></embed>
								</td>
								<td>{movie.name}</td>
								<td>{movie.premiere_date}</td>
								<td>{movie.genre}</td>

								<td>
									<ViewMovie movie={movie} />
									<EditMovie movie={movie} genres={genres} ratings={ratings} />
									<DeleteMovie movie={movie} />
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Container>
		</>
	);
}

export async function getServerSideProps() {
	await dbConnect();

	const movies = await getMovies();
	const genres = await getGenres();
	const ratings = await getRatings();

	return {
		props: {
			movies: JSON.parse(JSON.stringify(movies)),
			genres: JSON.parse(JSON.stringify(genres)),
			ratings: JSON.parse(JSON.stringify(ratings)),
		},
	};
}
