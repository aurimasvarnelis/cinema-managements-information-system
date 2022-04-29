import { Button, Col, Container, Dropdown, DropdownButton, FloatingLabel, Form, FormControl, Image, InputGroup, Modal, Row, Stack, Table } from "react-bootstrap";

import moment from "moment";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";

export function EditSession({ sessions, session, movies, rooms, movie, cinemaId, ticketTypes }) {
	// Model state
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	// Validation
	const [validated, setValidated] = useState(false);
	// Form hook
	const { register, handleSubmit, setValue } = useForm();

	const [error, setError] = useState(false);
	const [schedule, setSchedule] = useState(sessions);

	// Refreshing page after updating data
	const router = useRouter();
	const refreshData = () => router.replace(router.asPath);

	useEffect(() => {
		const filteredSessions = sessions.filter(
			(roomSession) => roomSession.room._id === session.room._id && roomSession._id !== session._id && roomSession.start_time.slice(0, 10) === session.start_time.slice(0, 10)
		);
		setSchedule(filteredSessions);
	}, [sessions, session]);

	const putData = async (data) => {
		data.cinema_id = cinemaId;
		data.display_time = moment(data.start_time).format("HH:mm") + " - " + moment(data.end_time).format("HH:mm");

		const room = await rooms.find((room) => room._id === data.room);

		const customRoom = {
			_id: room._id,
			name: room.name,
			total_seats: room.total_seats,
			occupied_seats: room.occupied_seats,
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
		if (res.status < 300) refreshData();
	};

	const onMovieChange = (e) => {
		movie = movies.find((movie) => movie._id === e.target.value);
		onStartDateTimeChange(session.start_time);
	};

	const onRoomChange = (e) => {
		const filteredSessions = sessions.filter(
			(roomSession) => roomSession.room._id === e.target.value && roomSession._id !== session._id && roomSession.start_time.slice(0, 10) === session.start_time.slice(0, 10)
		);
		setSchedule(filteredSessions);
	};

	const onStartDateTimeChange = (startTime) => {
		var date = moment(startTime);
		date.add(movie.duration, "m");
		setValue("end_time", date.format("YYYY-MM-DDTHH:mm"));
		isOverlapping(startTime, date.format("YYYY-MM-DDTHH:mm"), session.room._id);
		const filteredSessions = sessions.filter((roomSession) => roomSession.room._id === session.room._id && roomSession.start_time.slice(0, 10) === startTime.slice(0, 10));
		setSchedule(filteredSessions);
	};

	const isOverlapping = (startTime, endTime, room) => {
		const newSession = {
			start_time: startTime,
			end_time: endTime,
			room: room,
		};

		const overlappingSessions = sessions.filter((filterSession) => {
			if (filterSession.room._id === newSession.room) {
				if (
					moment(newSession.start_time).isBetween(filterSession.start_time, filterSession.end_time) ||
					moment(newSession.end_time).isBetween(filterSession.start_time, filterSession.end_time)
				) {
					return true;
				}
			}
			return false;
		});

		if (overlappingSessions.length > 0) {
			setError(true);
		} else {
			setError(false);
		}
	};

	const onSubmit = (data, event) => {
		const form = event.target;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			setValidated(true);
		} else {
			if (!error) {
				putData(data);
				handleClose();
				setValidated(false);
			}
		}
		//alert(`Session ${data.name} has been added.`)
	};

	return (
		<>
			<Button variant="outline-warning" className="me-2" onClick={handleShow}>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
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
					<Form noValidate id="hook-form" validated={validated} onSubmit={handleSubmit(onSubmit)}>
						<Row className="mb-3">
							<Form.Group className="mb-3" as={Col}>
								<Form.Label htmlFor="movie">Movie</Form.Label>
								<Form.Select defaultValue={session.movie_id._id} onChangeCapture={onMovieChange} {...register("movie_id")}>
									<option key="blankMovie" hidden value>
										Select movie
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
								<Form.Select defaultValue={session.room._id} onChangeCapture={onRoomChange} {...register("room")}>
									<option key="blankRoom" hidden value>
										Select room
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
								<Form.Label>Start time</Form.Label>
								<Form.Control
									required
									type="datetime-local"
									format="yyyy/mm/dd"
									min={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
									placeholder="Start time"
									onChangeCapture={(e) => onStartDateTimeChange(e.target.value)}
									defaultValue={moment(session.start_time).format("YYYY-MM-DDTHH:mm")}
									isInvalid={error}
									{...register("start_time")}
								/>
								{error && <Form.Control.Feedback type="invalid">Selected time is overlapping with others</Form.Control.Feedback>}
							</Form.Group>
							<Form.Group className="mb-3" as={Col}>
								<Form.Label>End time</Form.Label>
								<Form.Control disabled type="datetime-local" defaultValue={moment(session.end_time).format("YYYY-MM-DDTHH:mm")} {...register("end_time")} />
							</Form.Group>
						</Row>
						<Row>
							<Form.Group>
								<Form.Label>Tickets</Form.Label>
							</Form.Group>
							<Col>
								{ticketTypes.map((ticketType, idx) => {
									setValue(`ticket_types[${idx}].ticket_type_name`, ticketType);
									return (
										<Form.Group key={idx} className="mb-3">
											<Form.Control disabled value={ticketType} {...register(`ticket_types[${idx}].ticket_type_name`)} />
										</Form.Group>
									);
								})}
							</Col>
							<Col>
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
						<Row>
							<Form.Group>
								<Form.Label>Sessions</Form.Label>
								<Table>
									<thead>
										<tr>
											<th>Movie</th>
											<th>Room</th>
											<th>Start time</th>
											<th>End time</th>
										</tr>
									</thead>
									<tbody>
										{schedule.map((roomSession) => {
											if (roomSession.room._id === session.room._id && roomSession._id !== session._id && roomSession.start_time.slice(0, 10) === session.start_time.slice(0, 10)) {
												return (
													<tr key={roomSession._id}>
														<td>{roomSession.movie_id.name}</td>
														<td>{roomSession.room.name}</td>
														<td>{moment(roomSession.start_time).format("DD/MM/YYYY HH:mm")}</td>
														<td>{moment(roomSession.end_time).format("DD/MM/YYYY HH:mm")}</td>
													</tr>
												);
											}
											return null;
										})}
										{schedule.length === 0 && (
											<tr>
												<td colSpan="4">No sessions</td>
											</tr>
										)}
									</tbody>
								</Table>
							</Form.Group>
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
