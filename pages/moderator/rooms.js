import {
	Button,
	Col,
	Container,
	Form,
	Modal,
	Row,
	Table,
} from "react-bootstrap";

import { AddRoom } from "../../components/moderator/rooms/AddRoom";
import { DeleteRoom } from "../../components/moderator/rooms/DeleteRoom";
import { EditRoom } from "../../components/moderator/rooms/EditRoom";
import { ViewRoom } from "../../components/moderator/rooms/ViewRoom";
import dbConnect from "../../lib/dbConnect";
import { getCookie } from "cookies-next";
import { getRooms } from "../../controllers/roomController";

export default function Rooms({ rooms, cinemaId }) {
	return (
		<>
			<Container>
				<AddRoom cinemaId={cinemaId} />

				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Name</th>
							<th>Capacity</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{rooms.map((room) => (
							<tr key={room._id} className="item-row">
								<td>{room.name}</td>

								<td>{room.capacity}</td>

								<td>
									<ViewRoom room={room} />
									<EditRoom room={room} cinemaId={cinemaId} />
									<DeleteRoom room={room} cinemaId={cinemaId} />
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Container>
		</>
	);
}

export async function getServerSideProps({ req, res }) {
	await dbConnect();

	const cinemaId = getCookie("cinemaId", { req, res });
	const rooms = await getRooms(cinemaId);

	return {
		props: {
			rooms: JSON.parse(JSON.stringify(rooms)),
			cinemaId: cinemaId,
		},
	};
}
