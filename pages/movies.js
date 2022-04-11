import dbConnect from '../lib/dbConnect'
import Movie from '../models/Movie'
import { Button, Col, Container, Row, Modal, Form, Table, Card } from "react-bootstrap"
import Image from 'next/image'

export default function movies({ movies }) {
  return (
    <>
      <Container>
        <Row xs={2} md={4} lg={4}>
          
            {movies.map((movie) => (
              <Col key={movie._id}>
                <Card>
                  <Image 
                    className="d-block w-100"
                    src={movie.poster}
                    alt="First slide"
                    width="686px"
                    height="1016px"
                    layout="responsive" 
                  />
                  <Card.Body>
                    <Card.Title>{movie.name}</Card.Title>
                    <Card.Text>
                      {movie.description}
                    </Card.Text>
                    <Card.Text>
                      {movie.genre}
                    </Card.Text>
      
                  </Card.Body>
                </Card> 
              </Col>
            ))}
          
        </Row>
                     
      </Container>
    </>
    
  )
}

export async function getServerSideProps() {
  await dbConnect()

  /* find all the data in our database */
  const result = await Movie.find({})
  // const movies = result.map((doc) => {
  //   const movie = doc.toObject()
  //   movie._id = movie._id.toString()
  //   return movie
  // })

  return { props: { movies: JSON.parse(JSON.stringify(result)) } }
}
