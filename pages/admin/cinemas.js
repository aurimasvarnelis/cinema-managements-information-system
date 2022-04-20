import dbConnect from "../../lib/dbConnect";
import {
	Button,
	Col,
	Container,
	Row,
	Modal,
	Form,
	Table,
} from "react-bootstrap";
import { AddCinema } from "../../components/admin/cinemas/AddCinema";
import { ViewCinema } from "../../components/admin/cinemas/ViewCinema";
import { EditCinema } from "../../components/admin/cinemas/EditCinema";
import { DeleteCinema } from "../../components/admin/cinemas/DeleteCinema";

import { getCinemas } from "../../controllers/cinemaController";
import { getUsers } from "../../controllers/userController";

// TODO: add managers and let edit them
export default function cinemas({ cinemas, users }) {
	return (
		<>
			<Container>
				<AddCinema />

				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Name</th>
							<th>Location</th>
							<th>Managers</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{cinemas.map((cinema) => (
							<tr key={cinema._id} className="item-row">
								<td>{cinema.name}</td>

								<td>{cinema.location}</td>

								<td>
									{cinema.managers.map((manager, idx) => (
										<li key={idx}>
											{users.find((user) => user._id === manager).email}
										</li>
									))}
									{/* {cinema.managers.map((manager) => {
										return users.map((user) => {
											if (user._id === manager) {
												return user.email;
											}
										});
									})} */}
								</td>

								<td>
									<ViewCinema cinema={cinema} users={users} />
									<EditCinema cinema={cinema} />
									<DeleteCinema cinema={cinema} />
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

	const cinemas = await getCinemas();
	const users = await getUsers();

	return {
		props: {
			cinemas: JSON.parse(JSON.stringify(cinemas)),
			users: JSON.parse(JSON.stringify(users)),
		},
	};
}
