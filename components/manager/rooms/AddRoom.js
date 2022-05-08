import { Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, Image, InputGroup, Modal, Row, Stack, Table } from "react-bootstrap";

import { getCookie } from "cookies-next";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";

export function AddRoom({ cinemaId }) {
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

	const [rows, setRows] = useState([]);
	const [columns, setColumns] = useState([
		{
			status: 0,
		},
	]);

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

	const postData = async (data) => {
		data.rows = rows;
		data.total_seats = getRoomTotalSeats();
		data.occupied_seats = 0;
		const res = await fetch(`/api/cinemas/${cinemaId}/rooms`, {
			method: "POST",
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
			postData(data);
			//handleClose();
			//reset();
			setValidated(false);
		}
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
			<Button className="my-3" variant="success" onClick={handleShow}>
				<div className="p-1 d-inline">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
						<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
						<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
					</svg>
				</div>
				<div className="p-1 d-inline">Add room</div>
			</Button>

			<Modal
				size="xl"
				show={show}
				onHide={() => {
					handleClose();
					setValidated(false);
				}}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Add room</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form noValidate id="hook-form" validated={validated} onSubmit={handleSubmit(onSubmit)}>
						<Form.Group className="mb-3" controlId="validationName">
							<Form.Label>Name</Form.Label>
							<Form.Control required type="text" placeholder="Room name" {...register("name")} />
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
					<Button variant="primary" type="submit" form="hook-form">
						Submit
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
