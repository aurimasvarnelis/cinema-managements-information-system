import dbConnect from '../../lib/dbConnect'
import Movie from '../../models/Movie'
import { Button, Col, Container, Row, Modal, Form } from "react-bootstrap"
import { useState } from 'react'
import { AddMovie } from "../../components/moderator/movies/AddMovie"
import { ViewMovie } from "../../components/moderator/movies/ViewMovie"
import { EditMovie } from "../../components/moderator/movies/EditMovie"
import { DeleteMovie } from "../../components/moderator/movies/DeleteMovie"

export default function movies({ movies }) {
  return (
    <>
      <Container>     
        <AddMovie />
             
        <Row className="item-header">
          <Col>
            Poster
          </Col>
          <Col>
            Name
          </Col>
          <Col>
            Premiere date
          </Col>
          <Col>
            Genre
          </Col>
          <Col>
            Actions
          </Col>
        </Row>
        {/* Create a card for each movie */}
        {movies.map((movie) => (
          <Row key={movie._id} className="item-row">
            {/* <img src={movie.image_url} /> */}
            <Col><embed src={movie.poster} height="100px"></embed></Col>

            <Col>
              {movie.name}
              {/* <ul>
                {movie.writers.map((data, index) => (
                  <li key={index}>{data} </li>
                ))}
              </ul> */}
            </Col>

            <Col>
              {movie.premiere_date}
              {/* <ul>
                {movie.actors.map((data, index) => (
                  <li key={index}>{data} </li>
                ))}
              </ul> */}
            </Col>
            <Col>
              {movie.genre}
            </Col>

            <Col>
              <ViewMovie movie={movie}/>
              <EditMovie movie={movie}/>
              <DeleteMovie movie={movie}/>
            </Col>
          </Row>
        ))}
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


