import styles from "./movies.module.scss";
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
import Link from "next/link";
export default function Movies({ movies, genres, ratings }) {
  // checkbox filter for movies
  const [filterGenre, setGenreFilter] = useState([]);
  const [filterRating, setRatingFilter] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState(movies);

  // handle filter movies by filterGenre and filterRating
  const handleFilter = () => {
    const filtered = movies.filter((movie) => {
      if (filterGenre.length > 0) {
        if (filterGenre.includes(movie.genre)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });
    const filtered2 = filtered.filter((movie) => {
      if (filterRating.length > 0) {
        if (filterRating.includes(movie.rating)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });
    setFilteredMovies(filtered2);
  };

  useEffect(() => {
    handleFilter();
  }, [filterGenre, filterRating]);

  return (
    <>
      <Container>
        <Row>
          <Col xs={0} md={0} lg={2} xl={2}>
            <div className="filter">
              <h2>Genre</h2>
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
              <h2>Rating</h2>
              <Form.Group controlId="formBasicCheckbox">
                {ratings.map((rating, idx) => {
                  return (
                    <Form.Check
                      type="checkbox"
                      label={rating}
                      value={rating}
                      key={idx}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRatingFilter([...filterRating, e.target.value]);
                        } else {
                          setRatingFilter(
                            filterRating.filter(
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
          <Col xs={12} md={12} lg={10} xl={10}>
            <Row>
              {filteredMovies.map((movie) => (
                <Col key={movie._id} xs={6} md={6} lg={4} xl={3}>
                  <Link href={`/movies/${movie._id}`}>
                    <Card
                      className={`my-3 ${styles.movieCard}`}
                    >
                      <div>
                        <Image
                          className="movie-poster rounded-3"
                          src={movie.poster}
                          alt="First slide"
                          width="686px"
                          height="1016px"
                          layout="responsive"
                        />
                      </div>

                      <Card.Body className={styles.movieInfo}>
                        <Card.Title className={styles.movieTitle}>
                          {movie.name}
                        </Card.Title>
                        <Card.Text className={styles.movieDetails}>
                          {movie.genre} | {movie.rating} | {movie.duration} min.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
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
