import { Button, Col, Container, Row, Modal, Form, Table, Image, Stack, InputGroup, FormControl, DropdownButton, Dropdown } from "react-bootstrap"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useEffect } from "react"
import { getCookie } from 'cookies-next';
import moment from "moment"

// TODO: fix refresh on cinema change
export function AddSession() {
  // Model state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Validation
  const [validated, setValidated] = useState(false);
  // Form hook
  const { register, handleSubmit, reset, setValue } = useForm();
  
  const cinemaId = getCookie('cinemaId')

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

  // fetch rooms from api
  const [rooms, setRooms] = useState([]);
  const fetchRooms = async () => {
    const res = await fetch(`/api/cinemas/${cinemaId}/rooms`);
    const data = await res.json();
    setRooms(data);
  }

  useEffect(() => {
   fetchMovies();
   fetchRooms();
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
    if (res.status < 300) {
      refreshData()
    }
  }

  const [movie, setMovie] = useState();
  const [disabled, setDisabled] = useState(true);

  const onMovieChange = (e) => {
    setMovie(movies.find(movie => movie._id === e.target.value))
    setDisabled(false)
  }

  const onStartTimeChange = (e) => {
    var time = moment(e.target.value,'HH:mm')
    time.add(movie.duration,'m')
    setValue('end_time', time.format('HH:mm'))
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
              <Form.Select {...register("movie")} onChange={onMovieChange}>  
                <option key="blankChoice" hidden value> Select movie </option>        
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>{movie.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="movie">Room</Form.Label>
              <Form.Select {...register("room")}>  
                <option key="blankChoice" hidden value> Select room </option>        
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start time</Form.Label>
              <Form.Control required disabled={disabled} type="time" placeholder="Start time" onSelect={onStartTimeChange} {...register("start_time")}/>
            </Form.Group>            
            <Form.Group className="mb-3">
              <Form.Label>End time</Form.Label>
              <Form.Control disabled type="time" {...register("end_time")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="census">Status</Form.Label>
              <Form.Select placeholder="Actors" {...register("status")}>  
                <option key="blankChoice" hidden value> Select status </option>         
                <option>Public</option>
                <option>Private</option>
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