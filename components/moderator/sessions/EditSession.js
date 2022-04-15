import {
	Button,
	Col,
	Container,
	Dropdown,
	DropdownButton,
	FloatingLabel,
	Form,
	FormControl,
	Image,
	InputGroup,
	Modal,
	Row,
	Stack,
	Table,
} from "react-bootstrap";

import { getCookie } from "cookies-next";
import moment from "moment";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";

export function EditSession({
	session,
	movies,
	rooms,
	movie,
	cinemaId,
	ticketTypes,
}) {
	// Model state
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	// Validation
	const [validated, setValidated] = useState(false);
	// Form hook
	const { register, handleSubmit, setValue } = useForm();

	// Refreshing page after updating data
	const router = useRouter();
	const refreshData = () => router.replace(router.asPath);

	const putData = async (data) => {
		data.cinema_id = cinemaId;
		data.display_time =
			moment(data.start_time).format("HH:mm") +
			" - " +
			moment(data.end_time).format("HH:mm");

		const room = await rooms.find((room) => room._id === data.room);

		const customRoom = {
			name: room.name,
			capacity: room.capacity,
			cinema_id: room.cinema_id,
			rows: room.rows,
		};
		data.room = customRoom;

		const res = await fetch(`/api/sessions/${session._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		if (res.status < 300) {
			refreshData();
		}
	};

	const onMovieChange = (e) => {
		//console.log(movies.find((movie) => movie._id === e.target.value));
		movie = movies.find((movie) => movie._id === e.target.value);
	};

	const onStartDateTimeChange = (e) => {
		var date = moment(e.target.value);
		date.add(movie.duration, "m");
		setValue("end_time", date.format("YYYY-MM-DDTHH:mm"));
	};

	const onSubmit = (data, event) => {
		const form = event.target;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			setValidated(true);
		} else {
			putData(data);
			handleClose();
			setValidated(false);
		}
		//alert(`Session ${data.name} has been added.`)
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

			<Modal
				size="lg"
				show={show}
				onHide={() => {
					handleClose();
					setValidated(false);
				}}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Edit session</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form
						noValidate
						id="hook-form"
						validated={validated}
						onSubmit={handleSubmit(onSubmit)}
					>
						<Row className="mb-3">
							<Form.Group className="mb-3" as={Col}>
								<Form.Label htmlFor="movie">Movie</Form.Label>
								<Form.Select
									defaultValue={session.movie_id}
									{...register("movie_id")}
									onChange={onMovieChange}
								>
									<option key="blankMovie" hidden value>
										{" "}
										Select movie{" "}
									</option>
									{movies.map((movie) => (
										<option key={movie._id} value={movie._id}>
											{movie.name}
										</option>
									))}
								</Form.Select>
							</Form.Group>
							<Form.Group className="mb-3" as={Col}>
								<Form.Label htmlFor="movie">Room</Form.Label>
								<Form.Select
									defaultValue={session.room._id}
									{...register("room")}
								>
									<option key="blankRoom" hidden value>
										{" "}
										Select room{" "}
									</option>
									{rooms.map((room) => (
										<option key={room._id} value={room._id}>
											{room.name}
										</option>
									))}
								</Form.Select>
							</Form.Group>
						</Row>
						<Row className="mb-3">
							<Form.Group className="mb-3" as={Col}>
								<Form.Label>Start time </Form.Label>
								<Form.Control
									required
									type="datetime-local"
									min={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
									placeholder="Start time"
									onSelect={onStartDateTimeChange}
									defaultValue={moment(session.start_time).format(
										"YYYY-MM-DDTHH:mm"
									)}
									{...register("start_time")}
								/>
							</Form.Group>
							<Form.Group className="mb-3" as={Col}>
								<Form.Label>End time</Form.Label>
								<Form.Control
									disabled
									type="datetime-local"
									defaultValue={moment(session.end_time).format(
										"YYYY-MM-DDTHH:mm"
									)}
									{...register("end_time")}
								/>
							</Form.Group>
						</Row>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="census">Status</Form.Label>
							<Form.Select
								placeholder="Actors"
								defaultValue={session.status}
								{...register("status")}
							>
								<option key="blankChoice" hidden value>
									{" "}
									Select status{" "}
								</option>
								<option key="public" value="public">
									Public
								</option>
								<option key="private" value="private">
									Private
								</option>
							</Form.Select>
						</Form.Group>
						<Row>
							<Form.Group>
								<Form.Label>Tickets</Form.Label>
							</Form.Group>
							<Col>
								{ticketTypes.map((ticketType, idx) => {
									setValue(`ticket_types[${idx}].ticket_type_name`, ticketType);
									return (
										<Form.Group key={idx} className="mb-3">
											<Form.Control
												disabled
												value={ticketType}
												{...register(`ticket_types[${idx}].ticket_type_name`)}
											/>
										</Form.Group>
									);
								})}
							</Col>
							<Col>
								{/* // map form input ticket_types with ticket_type.type and
								ticket_type.price */}
								{ticketTypes.map((ticketType, idx) => (
									<Form.Group key={idx} className="mb-3">
										<Form.Control
											required
											type="number"
											min="0"
											step=".01"
											placeholder="Price"
											defaultValue={session.ticket_types[idx].price}
											{...register(`ticket_types[${idx}].price`)}
										/>
									</Form.Group>
								))}
							</Col>
						</Row>
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
