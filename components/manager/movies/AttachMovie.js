import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { ButtonToolbar, Typeahead, TypeaheadMenu } from "react-bootstrap-typeahead";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

export function AttachMovie({ allMovies, cinemas }) {
	// Model state
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	// Validation
	const [validated, setValidated] = useState(false);
	// Form hook
	const { register, handleSubmit, reset, setValue } = useForm();

	const [selectedCinemas, setSelectedCinemas] = useState([]);
	const [selectedMovies, setSelectedMovies] = useState([]);

	// Refreshing page after updating data
	const router = useRouter();
	const refreshData = () => router.replace(router.asPath);

	const updateMovies = async () => {
		const cinemasIds = selectedCinemas.map((cinema) => cinema._id);
		const moviesIds = selectedMovies.map((movie) => movie._id);
		console.log(cinemasIds);
		const res = await fetch("/api/movies/attach", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ cinemasIds, moviesIds }),
		});

		if (res.status < 300) refreshData();
		const resData = await res.json();
		console.log(resData);
	};

	const onSubmit = (data, event) => {
		const form = event.target;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			setValidated(true);
		} else {
			updateMovies(data);
			//handleClose();
			//reset();
			setValidated(false);
		}
	};

	return (
		<>
			<Button className="my-3" variant="success" onClick={handleShow}>
				<div className="p-1 d-inline">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
						<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
						<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
					</svg>
				</div>
				<div className="p-1 d-inline">Attach movie</div>
			</Button>

			<Modal
				size="lg"
				show={show}
				onHide={() => {
					handleClose();
					//setValidated(false);
				}}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Attach movie</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form noValidate id="hook-form" validated={validated} onSubmit={handleSubmit(onSubmit)}>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="role">Select cinemas</Form.Label>
							<Typeahead
								id="manager-select-cinemas"
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
										{/* <div>
											<small>Location: {option.location}</small>
										</div> */}
									</div>
								)}
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="role">Select movies</Form.Label>
							<Typeahead
								id="manager-select-cinemas"
								labelKey="name"
								multiple
								options={allMovies}
								placeholder="Choose movie..."
								onChange={(selected) => {
									setSelectedMovies(selected);
									console.log(selected);
								}}
								selected={selectedMovies}
								clearButton
								renderMenuItemChildren={(option) => (
									<div>
										{option.name}
										{/* <div>
											<small>Location: {option.location}</small>
										</div> */}
									</div>
								)}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" type="submit" form="hook-form">
						Submit
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
