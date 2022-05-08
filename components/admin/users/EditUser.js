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
	ButtonToolbar,
	Typeahead,
	TypeaheadMenu,
} from "react-bootstrap-typeahead";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

export function EditUser({ user, cinemas }) {
	// Model state
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// Refreshing page after updating data
	const router = useRouter();
	const refreshData = () => router.replace(router.asPath);

	const { register, handleSubmit } = useForm();

	const [userManager, setUserManager] = useState(user.role === "manager");
	const [selectedCinemas, setSelectedCinemas] = useState([]);

	const sortCinemas = () => {
		return cinemas.sort((a, b) => {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});
	};

	useEffect(() => {
		sortCinemas();
		if (user.role === "manager") {
			setUserManager(true);
			const filteredCinemas = cinemas.filter((cinema) => {
				return cinema.managers.includes(user._id);
			});
			setSelectedCinemas(filteredCinemas);
		}
	}, [user, userManager]);

	const updateCinemas = async (cinemasIds) => {
		console.log("cinema ids", cinemasIds);
		const response = await fetch(`/api/cinemas/update-managers`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userId: user._id, cinemasIds: cinemasIds }),
		});
		if (response.status < 300) refreshData();

		const resData = await response.json();
		console.log(resData);
	};

	const putData = async (data) => {
		if (userManager) {
			sortCinemas();
			const cinemasIds = selectedCinemas.map((cinema) => cinema._id);
			updateCinemas(cinemasIds);
		}
		const response = await fetch(`/api/users/${user._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (response.status < 300) refreshData();

		const resData = await response.json();
		console.log(resData);
	};

	const onSubmit = (data) => {
		putData(data);
		handleClose();
	};
	return (
		<>
			<Button variant="outline-warning" className="me-2" onClick={handleShow}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					fill="currentColor"
					viewBox="0 0 16 16"
				>
					<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
					<path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
				</svg>
			</Button>

			<Modal show={show} onHide={handleClose} centered>
				<Modal.Header closeButton>
					<Modal.Title>Edit user</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
						<Form.Group className="mb-3">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter name"
								defaultValue={user.name}
								{...register("name")}
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Email</Form.Label>
							<Form.Control
								required
								type="text"
								placeholder="Enter email"
								defaultValue={user.email}
								{...register("email")}
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="role">Role</Form.Label>
							<Form.Select
								required
								defaultValue={user.role}
								{...register("role")}
								onChange={(e) => {
									if (e.target.value === "manager") {
										setUserManager(true);
									} else {
										setUserManager(false);
									}
								}}
							>
								<option value="user">User</option>
								<option value="manager">Manager</option>
								<option value="admin">Admin</option>
							</Form.Select>
						</Form.Group>
						{userManager && (
							<Form.Group className="mb-3">
								<Form.Label htmlFor="role">Assign cinemas</Form.Label>
								<Typeahead
									id="user-assign-cinemas"
									labelKey="name"
									multiple
									options={cinemas}
									placeholder="Choose cinema..."
									onChange={(selected) => {
										setSelectedCinemas(selected);
										console.log(selected);
									}}
									selected={selectedCinemas}
									clearButton
									renderMenuItemChildren={(option) => (
										<div>
											{option.name}
											<div>
												<small>Location: {option.location}</small>
											</div>
										</div>
									)}
								/>
							</Form.Group>
						)}
						{/* <Form.Group className="mb-3" >
              <Form.Label>Email Verified</Form.Label>
              <Form.Control type="text" placeholder="Enter if email is verified" defaultValue={user.emailVerified} {...register("emailVerified")}/>
            </Form.Group> */}
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="primary" type="submit" form="hook-form">
						Update
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
