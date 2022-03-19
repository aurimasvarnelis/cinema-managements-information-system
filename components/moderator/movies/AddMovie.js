import { Button, Col, Container, Row, Modal, Form, Table } from "react-bootstrap"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'


export function AddMovie() {
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

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const postData = async (data) => {
    data.poster = await toBase64(data.poster[0])

    const res = await fetch('/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    // Check that our status code is in the 200s,
    // meaning the request was successful.
    if (res.status < 300) {
      refreshData();
    }
    const resData = await res.json()
    //console.log(resData)
  }

  const onSubmit = (data, event) => {
    const form = event.target;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    }
    else {
      postData(data);
      handleClose();
      reset();
      setValidated(false);
    }
    //alert(`Room ${data.name} has been added.`)
  };

  return (
    <>
      <Button className="my-3" variant="success" onClick={handleShow}>
          <div className="p-1 d-inline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
          </div>
          <div className="p-1 d-inline">
            Add a movie
          </div>
      </Button>
      
      <Modal size="lg" show={show} onHide={() => {handleClose(); setValidated(false);}} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add a movie</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
          <Form noValidate id="hook-form" validated={validated} onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="validationPoster">
              <Form.Label>Poster</Form.Label>
              <Form.Control required accept=".png, .jpg" type="file" {...register("poster")}/>
            </Form.Group>    
            {/* <Form.Group className="mb-3">
              <Form.Label htmlFor="cover">Cover</Form.Label>
              <Form.Control type="file" {...register("cover")}/>
            </Form.Group>             */}
            <Form.Group className="mb-3" controlId="validationName">
              <Form.Label>Name</Form.Label>
              <Form.Control required type="text" placeholder="Movie name"{...register("name")}/>
              {/* <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback> */}
              {/* <Form.Control.Feedback type="invalid">Please choose a movie name.</Form.Control.Feedback> */}
            </Form.Group>
            {/* <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Director(s)</Form.Label>
              <Form.Control  type="text" placeholder="Director(s)" {...register("director")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Writer(s)</Form.Label>
              <Form.Control  type="text" placeholder="Writer(s)" {...register("writer")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Actors(s)</Form.Label>
              <Form.Control  type="text" placeholder="Actors(s)" {...register("actor")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Age census</Form.Label>
              <Form.Select  {...register("census")}>   
                <option>V</option>
                <option>N-7</option>
                <option>N-13</option>
                <option>N-16</option>
                <option>N-18</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Genre</Form.Label>
              <Form.Select  {...register("genre")}>   
                <option>Drama</option>
                <option>Comedy</option>
                <option>Action</option>
                <option>N-16</option>
                <option>N-18</option>
              </Form.Select>
         
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Duration</Form.Label>
              <Form.Control  type="time" placeholder="Duration" {...register("duration")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Premiere</Form.Label>
              <Form.Control  type="date" placeholder="Premiere" {...register("premiere")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Description</Form.Label>
              <Form.Control  type="text" placeholder="Description" {...register("description")}/>
            </Form.Group>  */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" form="hook-form">
              Submit
          </Button>
        </Modal.Footer>
      </Modal>        
    </>   
  )
}