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

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

export function AddUser({ cinemas }) {
	// Model state
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// Refreshing page after updating data
	const router = useRouter();
	const refreshData = () => router.replace(router.asPath);

	const { register, handleSubmit } = useForm();

	const [userManager, setUserManager] = useState(false);
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
	}, [userManager]);

	const onSubmit = async (data) => {
		if (userManager) {
			sortCinemas();
			const cinemasIds = selectedCinemas.map((cinema) => cinema._id);
			data.manages = cinemasIds;
		}
		const status = await signIn("credentials", {
			redirect: false,
			email: data.email,
			password: data.password,
			role: data.role,
		});
		console.log(status);
		refreshData();
		handleClose();
		setSelectedCinemas([]);
		//alert(`Room ${data.name} has been added.`)
	};

	return (
		<>
			<Button className="my-3" variant="success" onClick={handleShow}>
				<div className="p-1 d-inline">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						className="bi bi-plus-square"
						viewBox="0 0 16 16"
					>
						<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
						<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
					</svg>
				</div>
				<div className="p-1 d-inline">Add user</div>
			</Button>

			<Modal size="lg" show={show} onHide={handleClose} centered>
				<Modal.Header closeButton>
					<Modal.Title>Add user</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="name">Email Address</Form.Label>
							<Form.Control
								required
								type="email"
								placeholder="Email Address"
								{...register("email")}
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="name">Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
								{...register("password")}
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="role">Role</Form.Label>
							<Form.Select
								required
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
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="primary" type="submit" form="hook-form">
						Create
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
