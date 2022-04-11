import dbConnect from "../lib/dbConnect";
import Movie from "../models/Movie";
import {
  Button,
  Col,
  Container,
  Row,
  Modal,
  Form,
  Table,
  Card,
} from "react-bootstrap";
import Image from "next/image";
import { useState } from "react";

export default function Movies({ movies }) {
  // checkbox filter for movies
  const [filter, setFilter] = useState([]);

  return (
    <>
      <Container>
        <Row>
          <Col xs={0} md={4} lg={4}></Col>
          <Col xs={12} md={8} lg={8}>
            <Row>
              {movies.map((movie) => (
                <Col key={movie._id} xs={6} md={4} lg={4}>
                  <Card>
                    <div className="card-image-top">
                      <Image
                        className="d-block w-100"
                        src={movie.poster}
                        alt="First slide"
                        width="686px"
                        height="1016px"
                        layout="responsive"
                      />
                    </div>

                    <Card.Body>
                      <Card.Title>{movie.name}</Card.Title>
                      <Card.Text>{movie.description}</Card.Text>
                      <Card.Text>{movie.genre}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  await dbConnect();

  /* find all the data in our database */
  const result = await Movie.find({});
  // const movies = result.map((doc) => {
  //   const movie = doc.toObject()
  //   movie._id = movie._id.toString()
  //   return movie
  // })

  return { props: { movies: JSON.parse(JSON.stringify(result)) } };
}
