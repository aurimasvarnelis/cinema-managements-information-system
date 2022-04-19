import { Button, Dropdown, Form, Modal } from "react-bootstrap";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function Logout({ router }) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handleLogout = async (e) => {
		e.preventDefault();
		router.replace(router.asPath);
		//router.push("/");
		signOut({ callbackUrl: `${process.env.url}` });
		handleClose();
	};

	return (
		<>
			<Dropdown.Item as="div" variant="dark" onClick={handleShow}>
				Logout
			</Dropdown.Item>

			<Modal size="sm" centered show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Confirm</Modal.Title>
				</Modal.Header>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button
						variant="primary"
						onClick={(e) => {
							handleLogout(e);
						}}
					>
						Logout
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
