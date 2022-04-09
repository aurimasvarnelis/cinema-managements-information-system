import { Button, Col, Container, Row, Modal, Form, Table, Image, Stack, InputGroup, FormControl, DropdownButton, Dropdown } from "react-bootstrap"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useEffect } from "react"

export function AddSession() {
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
  const refreshData = () => router.replace(router.asPath);
  

  // fetch movies from api
  const [movies, setMovies] = useState([]);
  const fetchMovies = async () => {
    const res = await fetch('/api/movies');
    const data = await res.json();
    setMovies(data);
  }
  useEffect(() => {
   fetchMovies();
  }, [])

  // post data using form data and rows
  const postData = async (data) => {
    const res = await fetch('/api/sessions', {
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
    // const resData = await res.json()
    // console.log(resData)
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
      //handleClose();
      reset();
      setValidated(false);
    }
    //alert(`Session ${data.name} has been added.`)
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
            Add a session
          </div>
      </Button>
      
      <Modal size="lg" show={show} onHide={() => {handleClose(); setValidated(false);}} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add a session</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
          <Form noValidate id="hook-form" validated={validated} onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="movie">Movie</Form.Label>
              <Form.Select {...register("movie")}>  
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>{movie.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
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