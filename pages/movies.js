import dbConnect from "../lib/dbConnect";
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
import { useEffect, useState } from "react";
import {
  getMovies,
  getGenres,
  getRatings,
} from "../controllers/movieController";
export default function Movies({ movies, genres, ratings }) {
  // checkbox filter for movies
  const [filterGenre, setGenreFilter] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState(movies);

  // handle filter movies by filterGenre
  const handleFilter = () => {
    if (filterGenre.length === 0) {
      setFilteredMovies(movies);
    } else {
      setFilteredMovies(
        movies.filter((movie) => {
          return filterGenre.includes(movie.genre);
        })
      );
    }
  };
  useEffect(() => {
    handleFilter();
  }, [filterGenre]);

  return (
    <>
      <Container>
        <Row>
          <Col xs={0} md={4} lg={4}>
            <div className="filter">
              <h2>Genre</h2>
              {/* // checkbox filter map genres for movies  */}
              <Form.Group controlId="formBasicCheckbox">
                {genres.map((genre, idx) => {
                  return (
                    <Form.Check
                      type="checkbox"
                      label={genre}
                      value={genre}
                      key={idx}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGenreFilter([...filterGenre, e.target.value]);
                        } else {
                          setGenreFilter(
                            filterGenre.filter(
                              (item) => item !== e.target.value
                            )
                          );
                        }
                      }}
                    />
                  );
                })}
              </Form.Group>
            </div>
          </Col>
          <Col xs={12} md={8} lg={8}>
            <Row>
              {filteredMovies.map((movie) => (
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

  const movies = await getMovies();
  const genres = await getGenres();
  const ratings = await getRatings();

  return {
    props: {
      movies: JSON.parse(JSON.stringify(movies)),
      genres: JSON.parse(JSON.stringify(genres)),
      ratings: JSON.parse(JSON.stringify(ratings)),
    },
  };
}
