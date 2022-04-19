import {
	Button,
	Col,
	Container,
	Form,
	Modal,
	Row,
	Table,
} from "react-bootstrap";

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";

// TODO: add user from
export function AddUser() {
	// Model state
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const { register, handleSubmit } = useForm();

	// Refreshing page after updating data
	const router = useRouter();
	const refreshData = () => {
		router.replace(router.asPath);
	};

	const postData = async (data) => {
		const res = await fetch("/api/cinemas", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		// Check that our status code is in the 200s,
		// meaning the request was successful.
		if (res.status < 300) {
			refreshData();
		}

		const resData = await res.json();
		console.log(resData);
	};

	const onSubmit = (data) => {
		postData(data);
		handleClose();
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
					<Modal.Title>Add a cinema</Modal.Title>
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
							<Form.Select required {...register("role")}>
								<option value="user">User</option>
								<option value="manager">Manager</option>
								<option value="admin">Admin</option>
							</Form.Select>
						</Form.Group>
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
