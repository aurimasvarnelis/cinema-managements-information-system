import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";

export function EditCinema({ cinema }) {
	// Model state
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const { register, handleSubmit } = useForm();

	// Refreshing page after updating data
	const router = useRouter();
	const refreshData = () => router.replace(router.asPath);

	const putData = async (data) => {
		console.log(data);
		const res = await fetch(`/api/cinemas/${cinema._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: data.name,
				location: data.location,
			}),
		});

		if (res.status < 300) refreshData();
		const resData = await res.json();
		console.log(resData);
	};

	const onSubmit = (data) => {
		putData(data);
		handleClose();
	};

	return (
		<>
			<Button variant="outline-warning" className="me-2" onClick={handleShow}>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
					<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
					<path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
				</svg>
			</Button>

			<Modal show={show} onHide={handleClose} centered>
				<Modal.Header closeButton>
					<Modal.Title>Edit cinema</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
						<Form.Group className="mb-3">
							<Form.Label>Name</Form.Label>
							<Form.Control required type="text" placeholder="Enter name" defaultValue={cinema.name} {...register("name")} />
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Location</Form.Label>
							<Form.Control required type="text" placeholder="Enter location" defaultValue={cinema.location} {...register("location")} />
						</Form.Group>
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
