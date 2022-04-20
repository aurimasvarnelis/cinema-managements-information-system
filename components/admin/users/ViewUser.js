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

import { useForm } from "react-hook-form";
import { useState } from "react";

export function ViewUser({ user, cinemas }) {
	// Model state
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	let selectedCinemas = [];

	if (user.role === "manager") {
		selectedCinemas = cinemas.filter((cinema) => {
			return cinema.managers.includes(user._id);
		});
	}

	return (
		<>
			<Button variant="outline-primary" className="me-2" onClick={handleShow}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					fill="currentColor"
					viewBox="0 0 16 16"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
						<path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z" />
					</svg>
				</svg>
			</Button>

			<Modal show={show} onHide={handleClose} centered>
				<Modal.Header closeButton>
					<Modal.Title>View user</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form id="hook-form">
						<Form.Group className="mb-3">
							<Form.Label>Name</Form.Label>
							<Form.Control disabled defaultValue={user.name} />
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Email</Form.Label>
							<Form.Control disabled defaultValue={user.email} />
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Role</Form.Label>
							<Form.Control disabled defaultValue={user.role} />
						</Form.Group>
						{user.role === "manager" && (
							<Form.Group className="mb-3">
								<Form.Label htmlFor="role">Assign cinemas</Form.Label>
								<Typeahead
									id="role"
									labelKey="name"
									multiple
									disabled
									defaultSelected={selectedCinemas}
									options={user.manages}
									placeholder="Select cinemas"
								/>
							</Form.Group>
						)}
						{/* <Form.Group className="mb-3" >
              <Form.Label>Email Verified</Form.Label>
              <Form.Control disabled defaultValue={user.emailVerified}/>
            </Form.Group> */}
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
