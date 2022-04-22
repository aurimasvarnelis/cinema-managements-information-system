import { Button, Col, Container, Form, Modal, Row, Tab, Table, Tabs } from "react-bootstrap";

import { AddRoom } from "../../components/manager/rooms/AddRoom";
import { DeleteRoom } from "../../components/manager/rooms/DeleteRoom";
import { EditRoom } from "../../components/manager/rooms/EditRoom";
import { ViewRoom } from "../../components/manager/rooms/ViewRoom";
import dbConnect from "../../lib/dbConnect";
import { getCinemasByManager } from "../../controllers/cinemaController";
import { getRoomsByCinemas } from "../../controllers/roomController";
import { getSession } from "next-auth/react";
import styles from "./movies.module.scss";

//import { getCookie } from "cookies-next";

export default function Rooms({ rooms, cinemas }) {
	return (
		<>
			<Container>
				<Tabs defaultActiveKey="profile" id="cinema-tabs" className={styles.cinemaTabs}>
					{/* // map through all cinemas and get movies for each cinema */}
					{cinemas.map((cinema, cinemaIdx) => (
						<Tab eventKey={cinema._id} title={cinema.name} key={cinema._id} className={styles.cinemaTab}>
							<AddRoom cinemaId={cinema._id} />
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>#</th>
										<th>Name</th>
										<th>Capacity</th>

										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{rooms[cinemaIdx].map((room, movieIdx) => (
										<tr key={room._id} className="item-row">
											<td>{movieIdx + 1}</td>
											<td>{room.name}</td>

											<td>{room.capacity}</td>

											<td>
												<ViewRoom room={room} />
												<EditRoom room={room} cinemaId={cinema._id} />
												<DeleteRoom room={room} cinemaId={cinema._id} />
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

	const { user } = await getSession(context);
	const cinemas = await getCinemasByManager(user.id);
	const rooms = await getRoomsByCinemas(cinemas);
	return {
		props: {
			rooms: JSON.parse(JSON.stringify(rooms)),
			cinemas: JSON.parse(JSON.stringify(cinemas)),
		},
	};
}
