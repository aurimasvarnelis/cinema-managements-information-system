import { Button, Col, Container, Form, Modal, ProgressBar, Row, Tab, Table, Tabs } from "react-bootstrap";

import { AddSession } from "../../components/manager/sessions/AddSession";
import { DeleteSession } from "../../components/manager/sessions/DeleteSession";
import { EditSession } from "../../components/manager/sessions/EditSession";
import { ViewSession } from "../../components/manager/sessions/ViewSession";
import dbConnect from "../../lib/dbConnect";
import { getCinemasByManager } from "../../controllers/cinemaController";
import { getCookie } from "cookies-next";
import { getMoviesByCinemas } from "../../controllers/movieController";
import { getRoomsByCinemas } from "../../controllers/roomController";
import { getSession } from "next-auth/react";
import { getSessionsByCinemas } from "../../controllers/sessionController";
import { getTicketTypes } from "../../controllers/sessionController";
import moment from "moment";
import styles from "./movies.module.scss";

export default function Sessions({ cinemas, sessions, movies, rooms, ticketTypes }) {
	console.log(sessions);
	return (
		<>
			<Container>
				<Tabs defaultActiveKey={cinemas[0]._id} id="cinema-tabs" className={styles.cinemaTabs}>
					{/* // map through all cinemas and get movies for each cinema */}
					{cinemas.map((cinema, cinemaIdx) => (
						<Tab eventKey={cinema._id} title={cinema.name} key={cinema._id} className={styles.cinemaTab}>
							<AddSession movies={movies[cinemaIdx]} rooms={rooms[cinemaIdx]} cinemaId={cinema._id} ticketTypes={ticketTypes} />
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>#</th>
										<th>Movie</th>
										<th>Room</th>
										<th>Date</th>
										<th>Time</th>
										<th>Occupied</th>
										<th>Status</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									{sessions[cinemaIdx].map((session, sessionIdx) => {
										const movie = movies[cinemaIdx].find((movie) => movie._id === session.movie_id);
										const room = movies[cinemaIdx].find((room) => room._id === session.room_id);
										return (
											<tr key={session._id} className="item-row">
												<td>{sessionIdx + 1}</td>
												<td>{movie.name}</td>
												<td>{session.room.name}</td>
												<td>{moment(session.start_time).format("YYYY-MM-DD")}</td>
												<td>{session.display_time}</td>

												<td>
													{/* // count percentage of seats occupied by comparing total seats to occupied seats */}
													<ProgressBar
														now={(session.room.occupied_seats / session.room.total_seats) * 100}
														label={`${(session.room.occupied_seats / session.room.total_seats) * 100}%`}
														variant="success"
														striped
														visuallyHidden
													/>
												</td>
												<td>{session.status}</td>
												<td>
													<ViewSession session={session} movie={movie} />
													<EditSession
														session={session}
														movies={movies[cinemaIdx]}
														rooms={rooms[cinemaIdx]}
														movie={movie}
														cinemaId={cinema._id}
														ticketTypes={ticketTypes}
													/>
													<DeleteSession session={session} />
												</td>
											</tr>
										);
									})}
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

	//const cinemaId = getCookie("cinemaId", { req, res });

	const { user } = await getSession(context);
	const cinemas = await getCinemasByManager(user.id);
	const sessions = await getSessionsByCinemas(cinemas.map((cinema) => cinema._id));
	const movies = await getMoviesByCinemas(cinemas);
	const rooms = await getRoomsByCinemas(cinemas);
	const ticketTypes = await getTicketTypes();

	return {
		props: {
			cinemas: JSON.parse(JSON.stringify(cinemas)),
			sessions: JSON.parse(JSON.stringify(sessions)),
			movies: JSON.parse(JSON.stringify(movies)),
			rooms: JSON.parse(JSON.stringify(rooms)),
			ticketTypes: JSON.parse(JSON.stringify(ticketTypes)),
		},
	};
}
