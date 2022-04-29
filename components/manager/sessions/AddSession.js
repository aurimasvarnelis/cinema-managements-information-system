import { Button, Col, Container, Dropdown, DropdownButton, FloatingLabel, Form, FormControl, Image, InputGroup, Modal, Row, Stack, Table } from "react-bootstrap";

import moment from "moment";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";

export function AddSession({ sessions, movies, rooms, cinemaId, ticketTypes }) {
	// Model state
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	// Validation
	const [validated, setValidated] = useState(false);
	// Form hook
	const { register, handleSubmit, reset, setValue, getValues } = useForm();

	const [movie, setMovie] = useState();
	const [disabled, setDisabled] = useState(true);

	const [error, setError] = useState(false);
	const [schedule, setSchedule] = useState([]);

	// Refreshing page after updating data
	const router = useRouter();
	const refreshData = () => router.replace(router.asPath);

	useEffect(() => {
		if (getValues().room && getValues().start_time) {
			const filteredSessions = sessions.filter(
				(roomSession) => roomSession.room._id === getValues().room && roomSession.start_time.slice(0, 10) === getValues().start_time.slice(0, 10)
			);
			console.log(filteredSessions);
			setSchedule(filteredSessions);
		}
	}, [getValues().room]);

	const postData = async (data) => {
		data.cinema_id = cinemaId;
		data.display_time = moment(data.start_time).format("HH:mm") + " - " + moment(data.end_time).format("HH:mm");

		const room = await rooms.find((room) => room._id === data.room);

		const customRoom = {
			_id: room._id,
			name: room.name,
			total_seats: room.total_seats,
			occupied_seats: 0,
			rows: room.rows,
		};
		data.room = customRoom;

		const res = await fetch("/api/sessions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		if (res.status < 300) refreshData();
	};

	const onMovieChange = (e) => {
		setMovie(movies.find((movie) => movie._id === e.target.value));
		if (getValues().start_time) onStartDateTimeChange(getValues().start_time);
		setDisabled(false);
	};

	const onRoomChange = (e) => {
		if (getValues().start_time) {
			const filteredSessions = sessions.filter(
				(roomSession) => roomSession.room._id === e.target.value && roomSession.start_time.slice(0, 10) === getValues().start_time.slice(0, 10)
			);
			setSchedule(filteredSessions);
		} else {
			const filteredSessions = sessions.filter((roomSession) => roomSession.room._id === e.target.value);
			setSchedule(filteredSessions);
		}
		console.log(schedule);
	};

	const onStartDateTimeChange = (startTime) => {
		var date = moment(startTime);
		date.add(movie.duration, "m");
		setValue("end_time", date.format("YYYY-MM-DDTHH:mm"));
		isOverlapping(startTime, date.format("YYYY-MM-DDTHH:mm"), getValues().room);

		const filteredSessions = sessions.filter((roomSession) => roomSession.room._id === getValues().room && roomSession.start_time.slice(0, 10) === startTime.slice(0, 10));
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
				postData(data);
				//handleClose();
				//reset();
				setValidated(false);
			}
		}
		//alert(`Session ${data.name} has been added.`)
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
				<div className="p-1 d-inline">Add a session</div>
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
					<Modal.Title>Add a session</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form noValidate id="hook-form" validated={validated} onSubmit={handleSubmit(onSubmit)}>
						<Row className="mb-3">
							<Form.Group className="mb-3" as={Col}>
								<Form.Label htmlFor="movie">Movie</Form.Label>
								<Form.Select onChangeCapture={onMovieChange} {...register("movie_id")}>
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
								<Form.Select onChangeCapture={onRoomChange} {...register("room")}>
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
									disabled={disabled}
									type="datetime-local"
									min={moment(new Date()).format("YYYY-MM-DDTHH:mm")}
									placeholder="Start time"
									onChangeCapture={(e) => onStartDateTimeChange(e.target.value)}
									isInvalid={error}
									{...register("start_time")}
								/>
								{error && <Form.Control.Feedback type="invalid">Selected time is overlapping with others</Form.Control.Feedback>}
							</Form.Group>
							<Form.Group className="mb-3" as={Col}>
								<Form.Label>End time</Form.Label>
								<Form.Control disabled type="datetime-local" {...register("end_time")} />
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
										<Form.Control required type="number" min="0" step=".01" placeholder="Price" {...register(`ticket_types[${idx}].price`)} />
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
											return (
												<tr key={roomSession._id}>
													<td>{roomSession.movie_id.name}</td>
													<td>{roomSession.room.name}</td>
													<td>{moment(roomSession.start_time).format("DD/MM/YYYY HH:mm")}</td>
													<td>{moment(roomSession.end_time).format("DD/MM/YYYY HH:mm")}</td>
												</tr>
											);
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
					<Button variant="primary" type="submit" form="hook-form">
						Submit
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
