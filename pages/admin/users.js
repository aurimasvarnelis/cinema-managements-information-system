import {
	Button,
	Col,
	Container,
	Form,
	Modal,
	Row,
	Table,
} from "react-bootstrap";

import { AddUser } from "../../components/admin/users/AddUser";
import { DeleteUser } from "../../components/admin/users/DeleteUser";
import { EditUser } from "../../components/admin/users/EditUser";
import { ViewUser } from "../../components/admin/users/ViewUser";
import dbConnect from "../../lib/dbConnect";
import { getCinemas } from "../../controllers/cinemaController";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { getUsers } from "../../controllers/userController";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function Users({ users, cinemas }) {
	return (
		<>
			<Container>
				<AddUser cinemas={cinemas} />

				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Role</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user._id} className="item-row">
								<td>{user.name}</td>

								<td>{user.email}</td>
								<td>{user.role}</td>

								<td>
									<ViewUser user={user} cinemas={cinemas} />
									<EditUser user={user} cinemas={cinemas} />
									<DeleteUser user={user} />
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

	const users = await getUsers();
	const cinemas = await getCinemas();

	return {
		props: {
			users: JSON.parse(JSON.stringify(users)),
			cinemas: JSON.parse(JSON.stringify(cinemas)),
		},
	};
}
