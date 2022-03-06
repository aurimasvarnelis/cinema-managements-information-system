import Layout from "../../components/layout"
import dbConnect from '../../lib/dbConnect'
import Link from 'next/link'
import Movie from '../../models/Movie'
import { Button, Col, Container, Row, Modal, Form } from "react-bootstrap"
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function movies({ movies }) {
  return (
    <Layout>
      <Container>     
        <AddMovie />
             
        <Row className="item-header">
          <Col>
            Name
          </Col>
          <Col>
            Writers
          </Col>
          <Col>
            Actors
          </Col>
          <Col>
            Action
          </Col>
        </Row>
        {/* Create a card for each movie */}
        {movies.map((movie) => (
          <Row key={movie._id} className="item-row">
            {/* <img src={movie.image_url} /> */}
            <Col>{movie.name}</Col>

            <Col>
              <ul>
                {movie.writers.map((data, index) => (
                  <li key={index}>{data} </li>
                ))}
              </ul>
            </Col>

            <Col>
              <ul>
                {movie.actors.map((data, index) => (
                  <li key={index}>{data} </li>
                ))}
              </ul>
            </Col>

            <Col>
              <Link href="/[id]/edit" as={`/${movie._id}/edit`}>
                <button className="btn edit">Edit</button>
              </Link>
              <Link href="/[id]" as={`/${movie._id}`}>
                <button className="btn view">View</button>
              </Link>
            </Col>
          </Row>
        ))}
      </Container>
    </Layout>
  )
}

/* Retrieves movie(s) data from mongodb database */
export async function getServerSideProps() {
  await dbConnect()

  /* find all the data in our database */
  const result = await Movie.find({})
  const movies = result.map((doc) => {
    const movie = doc.toObject()
    movie._id = movie._id.toString()
    return movie
  })

  return { props: { movies: movies } }
}

export function AddMovie() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    doPost({
        data: {
            name: data.name,
            capacity: data.capacity,
            roomType: data.roomType,
        },
    });
    handleClose()
    //alert(`Room ${data.name} has been added.`)
  };


  return (
    <>
      <Button variant="success" onClick={handleShow}>
          <div className="p-1 d-inline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16">
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
          </div>
          <div className="p-1 d-inline">
            Add a movie
          </div>
      </Button>
      
      <Modal size="lg" show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add a movie</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
          <Form id="hook-form" onSubmit={handleSubmit(onSubmit)}>               
            <Form.Group className="mb-3">
              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Control required type="text" placeholder="Movie name" {...register("name")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Director(s)</Form.Label>
              <Form.Control required type="text" placeholder="Director(s)" {...register("director")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Writer(s)</Form.Label>
              <Form.Control required type="text" placeholder="Writer(s)" {...register("writer")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Actors(s)</Form.Label>
              <Form.Control required type="text" placeholder="Actors(s)" {...register("actor")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Age census</Form.Label>
              <Form.Select required {...register("census")}>   
                <option>V</option>
                <option>N-7</option>
                <option>N-13</option>
                <option>N-16</option>
                <option>N-18</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Genre</Form.Label>
              <Form.Select required {...register("genre")}>   
                <option>Drama</option>
                <option>Comedy</option>
                <option>Action</option>
                <option>N-16</option>
                <option>N-18</option>
              </Form.Select>
         
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Duration</Form.Label>
              <Form.Control required type="time" placeholder="Duration" {...register("duration")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Premiere</Form.Label>
              <Form.Control required type="date" placeholder="Premiere" {...register("premiere")}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="capacity">Description</Form.Label>
              <Form.Control required type="text" placeholder="Description" {...register("description")}/>
            </Form.Group> 
          </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="primary" type="submit" form="hook-form">
                Create
            </Button>
        </Modal.Footer>
      </Modal>        
    </>   
  )
}

export function viewMovie() {
  return (
    <div>movies</div>
  )
}

export function editMovie() {
  return (
    <div>movies</div>
  )
}

export function deleteMovie() {
  return (
    <div>movies</div>
  )
}


