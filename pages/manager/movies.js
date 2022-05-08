import { Button, Col, Container, Form, Modal, Row, Tab, Table, Tabs } from "react-bootstrap";
import { getMoviesByCinemas, getMoviesWithMainInfo } from "../../controllers/movieController";

import { AttachMovie } from "../../components/manager/movies/AttachMovie";
import { DetachMovie } from "../../components/manager/movies/DetachMovie";
import dbConnect from "../../lib/dbConnect";
import { getCinemasByManager } from "../../controllers/cinemaController";
import { getSession } from "next-auth/react";
import styles from "./movies.module.scss";

// import { getGenres, getMovies, getRatings } from "../../controllers/movieController";
// import { EditMovie } from "../../components/manager/movies/EditMovie";
// import { ViewMovie } from "../../components/manager/movies/ViewMovie";

export default function movies({ cinemas, movies, allMovies }) {
	return (
		<>
			<Container>
				<AttachMovie allMovies={allMovies} cinemas={cinemas} />
				<Tabs defaultActiveKey={cinemas[0]._id} id="cinema-tabs" className={styles.cinemaTabs}>
					{/* // map through all cinemas and get movies for each cinema */}
					{cinemas.map((cinema, cinemaIdx) => (
						<Tab eventKey={cinema._id} title={cinema.name} key={cinema._id} className={styles.cinemaTab}>
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>#</th>
										<th>Name</th>
										<th>Duration</th>
										<th>Age rating</th>
										<th>Genre</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{movies[cinemaIdx].map((movie, movieIdx) => (
										<tr key={movie._id}>
											<td>{movieIdx}</td>
											<td>{movie.name}</td>
											<td>{movie.duration} min.</td>
											<td>{movie.rating}</td>
											<td>{movie.genre}</td>
											<td>
												<DetachMovie cinemaId={cinema._id} movieId={movie._id} />
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</Tab>
					))}
				</Tabs>
			</Container>
		</>
	);
}

export async function getServerSideProps(context) {
	await dbConnect();

	// const userSession = await getSession(context);
	const { user } = await getSession(context);
	const cinemas = await getCinemasByManager(user.id);
	const movies = await getMoviesByCinemas(cinemas);
	const allMovies = await getMoviesWithMainInfo();

	return {
		props: {
			cinemas: JSON.parse(JSON.stringify(cinemas)),
			movies: JSON.parse(JSON.stringify(movies)),
			allMovies: JSON.parse(JSON.stringify(allMovies)),
		},
	};
}
