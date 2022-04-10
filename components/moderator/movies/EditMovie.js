import { Button, Col, Container, Row, Modal, Form, Table } from "react-bootstrap"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

// TODO: fix image upload preview
export function EditMovie({ movie }) {
  // Model state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Validation
  const [validated, setValidated] = useState(false);
  // Form hook
  const { register, handleSubmit, reset } = useForm();

  // Refreshing page after updating data
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath);
  }

  const putData = async (data) => {
    const res = await fetch(`/api/movies/${movie._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (res.status < 300) {
      refreshData();
    }
  }


  const onSubmit = (data, event) => {
    const form = event.target;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    }
    else {
      putData(data);
      handleClose();
      setValidated(false);
    }
    //alert(`Room ${data.name} has been added.`)
  };

  return (
    <>
      <Button variant="outline-warning" className="me-2" onClick={handleShow}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
          <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
        </svg>
      </Button>
      
      <Modal size="lg" show={show} onHide={() => {handleClose(); setValidated(false);}} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit movie</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
          <Form noValidate id="hook-form" validated={validated} onSubmit={handleSubmit(onSubmit)}> 
            {/* <Form.Group className="mb-3" controlId="validationPoster">
              <Form.Label>Poster</Form.Label>
              <Form.Control required accept=".png, .jpg" type="file" {...register("poster")}/>
              <Form.Group><embed height="100px" src={movie.poster}></embed></Form.Group>
            </Form.Group>             */}
            <Form.Group className="mb-3" >
              <Form.Label>Name</Form.Label>
              <Form.Control required type="text" placeholder="Enter name" defaultValue={movie.name} {...register("name")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="director">Director</Form.Label>
              <Form.Control  type="text" placeholder="Director" defaultValue={movie.director} {...register("director")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="actors">Actors</Form.Label>
              <Form.Control  type="text" placeholder="Actors" defaultValue={movie.actors} {...register("actors")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="census">Age census</Form.Label>
              <Form.Select defaultValue={movie.census} {...register("census")}>  
                <option key="blankChoice" hidden value> Select age census </option> 
                <option>V</option>
                <option>N-7</option>
                <option>N-13</option>
                <option>N-16</option>
                <option>N-18</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="genre">Genre</Form.Label>
              <Form.Select defaultValue={movie.genre} {...register("genre")}>
                <option key="blankChoice" hidden value> Select genre </option>    
                <option>Drama</option>
                <option>Comedy</option>
                <option>Action</option>
                <option>Animation</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="duration">Duration</Form.Label>
              <Form.Control  type="number" placeholder="Duration" defaultValue={movie.duration} {...register("duration")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="premiere_date">Premiere date</Form.Label>
              <Form.Control  type="date" placeholder="Premiere" defaultValue={movie.premiere_date} {...register("premiere_date")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="synopsis">Synopsis</Form.Label>
              <Form.Control  type="text" placeholder="Description" defaultValue={movie.synopsis} {...register("synopsis")}/>
            </Form.Group> 
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
  )
}
