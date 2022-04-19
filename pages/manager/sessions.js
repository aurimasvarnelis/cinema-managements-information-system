import {
	Button,
	Col,
	Container,
	Form,
	Modal,
	Row,
	Table,
} from "react-bootstrap";
import {
	getSessions,
	getTicketTypes,
} from "../../controllers/sessionController";

import { AddSession } from "../../components/manager/sessions/AddSession";
import { DeleteSession } from "../../components/manager/sessions/DeleteSession";
import { EditSession } from "../../components/manager/sessions/EditSession";
import { ViewSession } from "../../components/manager/sessions/ViewSession";
import dbConnect from "../../lib/dbConnect";
import { getCookie } from "cookies-next";
import { getMovies } from "../../controllers/movieController";
import { getRooms } from "../../controllers/roomController";
import moment from "moment";

export default function Sessions({
	sessions,
	movies,
	rooms,
	cinemaId,
	ticketTypes,
}) {
	return (
		<>
			<Container>
				<AddSession
					movies={movies}
					rooms={rooms}
					cinemaId={cinemaId}
					ticketTypes={ticketTypes}
				/>

				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Movie</th>
							<th>Room</th>
							<th>Date</th>
							<th>Time</th>
							<th>Status</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{sessions.map((session) => {
							const movie = movies.find(
								(movie) => movie._id === session.movie_id
							);
							const room = rooms.find((room) => room._id === session.room_id);
							return (
								<tr key={session._id} className="item-row">
									<td>{movie.name}</td>
									<td>{session.room.name}</td>
									<td>{moment(session.start_time).format("YYYY-MM-DD")}</td>
									<td>{session.display_time}</td>
									<td>{session.status}</td>
									<td>
										<ViewSession session={session} movie={movie} />
										<EditSession
											session={session}
											movies={movies}
											rooms={rooms}
											movie={movie}
											cinemaId={cinemaId}
											ticketTypes={ticketTypes}
										/>
										<DeleteSession session={session} />
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</Container>
		</>
	);
}

export async function getServerSideProps({ req, res }) {
	await dbConnect();

	const cinemaId = getCookie("cinemaId", { req, res });

	const sessions = await getSessions(cinemaId);
	const movies = await getMovies();
	const rooms = await getRooms(cinemaId);
	const ticketTypes = await getTicketTypes();

	return {
		props: {
			sessions: JSON.parse(JSON.stringify(sessions)),
			movies: JSON.parse(JSON.stringify(movies)),
			rooms: JSON.parse(JSON.stringify(rooms)),
			cinemaId: cinemaId,
			ticketTypes: JSON.parse(JSON.stringify(ticketTypes)),
		},
	};
}
