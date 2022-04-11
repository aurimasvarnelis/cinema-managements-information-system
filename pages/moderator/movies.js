import dbConnect from "../../lib/dbConnect";
// import Movie from "../../models/Movie";
import {
  Button,
  Col,
  Container,
  Row,
  Modal,
  Form,
  Table,
} from "react-bootstrap";
import { AddMovie } from "../../components/moderator/movies/AddMovie";
import { ViewMovie } from "../../components/moderator/movies/ViewMovie";
import { EditMovie } from "../../components/moderator/movies/EditMovie";
import { DeleteMovie } from "../../components/moderator/movies/DeleteMovie";
import { getMovies, getGenres, getRatings } from "../../controllers/movieController";

export default function movies({ movies, genres, ratings }) {
  return (
    <>
      <Container>
        <AddMovie genres={genres} ratings={ratings} />

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Poster</th>
              <th>Name</th>
              <th>Premiere date</th>
              <th>Genre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie._id} className="item-row">
                <td>
                  <embed src={movie.poster} height="100px"></embed>
                </td>
                <td>{movie.name}</td>
                <td>{movie.premiere_date}</td>
                <td>{movie.genre}</td>

                <td>
                  <ViewMovie movie={movie} />
                  <EditMovie movie={movie} genres={genres} ratings={ratings}/>
                  <DeleteMovie movie={movie} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
