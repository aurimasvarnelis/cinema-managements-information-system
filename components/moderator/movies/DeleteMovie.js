import { Button, Col, Container, Row, Modal, Form, Table } from "react-bootstrap"
import { useState } from 'react'
import { useRouter } from 'next/router'

export function DeleteMovie({ movie }) {
  // Model state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Refreshing page after updating data
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath);
  }

  const deleteData = async () => {
    const res = await fetch(`/api/movies/${movie._id}`, {
      method: 'DELETE',
    })
    // Check that our status code is in the 200s,
    // meaning the request was successful.
    if (res.status < 300) {
      refreshData();
    }

    const resData = await res.json()
    console.log(resData)
  }

  const onSubmit = () => {
    deleteData()
    handleClose() 
  };
  return (
    <>
      <Button variant="outline-danger" className="me-2" onClick={handleShow}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
        </svg>
      </Button>

      <Modal show={show} onHide={handleClose} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Delete movie</Modal.Title>
        </Modal.Header>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" type="submit" onClick={onSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>        
    </>  
  )
}
