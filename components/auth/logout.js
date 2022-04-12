import { useState } from "react";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
//import { useNavigate } from "react-router";
import { signOut } from "next-auth/react";

export default function Logout() {
  const [show, setShow] = useState(false);

  //const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = async () => {
    signOut();
    handleClose();
    //navigate("/");
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
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
