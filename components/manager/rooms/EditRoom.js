import { Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, Image, InputGroup, Modal, Row, Stack, Table } from "react-bootstrap";

import { getCookie } from "cookies-next";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";

export function EditRoom({ room, cinemaId }) {
	// Model state
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	// Validation
	const [validated, setValidated] = useState(false);
	// Form hook
	const { register, handleSubmit, reset } = useForm();

	const router = useRouter();
	const refreshData = () => router.replace(router.asPath);

	const [rows, setRows] = useState(room.rows);
	const [columns, setColumns] = useState(room.rows[0].columns);

	const getRoomTotalSeats = () => {
		let totalSeats = 0;
		rows.forEach((row) => {
			row.columns.forEach((column) => {
				if (column.status === 0) {
					totalSeats++;
				}
			});
		});
		return totalSeats;
	};

	const putData = async (data) => {
		data.rows = rows;
		data.total_seats = getRoomTotalSeats();
		const res = await fetch(`/api/cinemas/${cinemaId}/rooms/${room._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		if (res.status < 300) refreshData();
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
		//alert(`Room ${data.name} has been added.`)
	};

	const handleAddRow = () => {
		setRows([
			...rows,
			{
				columns: columns.map((column) => ({
					status: 0,
				})),
			},
		]);
	};

	const handleAddColumn = () => {
		setColumns([
			...columns,
			{
				status: 0,
			},
		]);
		handleAddColumnToAllRows();
	};

	const handleRemoveRow = () => {
		setRows(rows.slice(0, rows.length - 1));
	};

	const handleRemoveColumn = () => {
		setColumns(columns.slice(0, columns.length - 1));
		handleRemoveColumnFromAllRows();
	};

	const handleAddColumnToAllRows = () => {
		setRows(
			rows.map((row) => {
				return {
					...row,
					columns: [
						...row.columns,
						{
							status: 0,
						},
					],
				};
			})
		);
	};

	const handleRemoveColumnFromAllRows = () => {
		setRows(
			rows.map((row) => {
				return {
					...row,
					columns: row.columns.slice(0, row.columns.length - 1),
				};
			})
		);
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
				size="xl"
				show={show}
				onHide={() => {
					handleClose();
					setValidated(false);
					setRows(room.rows);
					setColumns(room.rows[0].columns);
				}}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Edit room</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form noValidate id="hook-form" validated={validated} onSubmit={handleSubmit(onSubmit)}>
						<Form.Group className="mb-3" controlId="validationName">
							<Form.Label>Name</Form.Label>
							<Form.Control required type="text" placeholder="Room name" defaultValue={room.name} {...register("name")} />
						</Form.Group>
					</Form>

					<Container fluid className="overflow-auto">
						{rows
							.map((row, rowIdx) => (
								<Stack direction="horizontal" gap={2} key={rowIdx}>
									<div style={{ width: "2rem" }}>{rowIdx + 1}</div>
									{row.columns.map((column, columnIdx) => (
										<div key={columnIdx}>
											{rowIdx === rows.length - 1 && <div>{columnIdx + 1}</div>}
											<div
												onClick={() => {
													if (column.status === 0) {
														row.columns[columnIdx].status = -1;
														setRows([...rows]);
													} else {
														row.columns[columnIdx].status = 0;
														setRows([...rows]);
													}
												}}
											>
												{row.columns[columnIdx].status === -1 ? (
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="gray" className="bi bi-circle-fill" viewBox="0 0 24 24">
														<circle cx="12" cy="12" r="12" />
													</svg>
												) : (
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="green" className="bi bi-circle-fill" viewBox="0 0 24 24">
														<circle cx="12" cy="12" r="12" />
													</svg>
												)}
											</div>
										</div>
									))}
								</Stack>
							))
							.reverse()}

						<div className="m-3 d-flex justify-content-center">
							<Button variant="success" className="me-5" onClick={handleAddRow} style={{ width: "10rem" }}>
								Add row
							</Button>

							<Button variant="success" onClick={handleAddColumn} style={{ width: "10rem" }}>
								Add column
							</Button>
						</div>

						<div className="m-3 d-flex justify-content-center">
							<Button variant="danger" className="me-5" onClick={handleRemoveRow} style={{ width: "10rem" }}>
								Remove row
							</Button>

							<Button variant="danger" onClick={handleRemoveColumn} style={{ width: "10rem" }}>
								Remove column
							</Button>
						</div>
					</Container>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => {
							handleClose();
							setRows(room.rows);
							setColumns(room.rows[0].columns);
						}}
					>
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
