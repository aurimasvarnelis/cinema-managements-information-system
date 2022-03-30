import dbConnect from '../../lib/dbConnect'
import Movie from '../../models/Movie'
import { Button, Col, Container, Row, Modal, Form } from "react-bootstrap"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AddMovie } from "../../components/moderator/movies/AddMovie"
import { ViewMovie } from "../../components/moderator/movies/ViewMovie"

export default function movies({ movies }) {
  return (
    <>
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
              {/* <ul>
                {movie.actors.map((data, index) => (
                  <li key={index}>{data} </li>
                ))}
              </ul> */}
            </Col>

            <Col>
              <ViewMovie movie={movie}/>
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


