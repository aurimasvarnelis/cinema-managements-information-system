import { Button, Col, Container, Form, Modal, Row, Stack, Table } from "react-bootstrap";

import { useState } from "react";

export function ViewRoom({ room }) {
	// Model state
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<Button variant="outline-primary" className="me-2" onClick={handleShow}>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
						<path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z" />
					</svg>
				</svg>
			</Button>

			<Modal size="xl" show={show} onHide={handleClose} centered>
				<Modal.Header closeButton>
					<Modal.Title>View room</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Group className="mb-3">
						<Form.Label>Name</Form.Label>
						<Form.Control disabled defaultValue={room.name} />
					</Form.Group>

					<Container fluid className="overflow-auto">
						{room.rows
							.map((row, rowIdx) => (
								<Stack direction="horizontal" gap={2} key={rowIdx}>
									<div>{rowIdx + 1}</div>
									{row.columns.map((column, columnIdx) => (
										<div key={columnIdx}>
											{rowIdx === room.rows.length - 1 && <div>{columnIdx + 1}</div>}

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
									))}
								</Stack>
							))
							.reverse()}
					</Container>
				</Modal.Body>
			</Modal>
		</>
	);
}
