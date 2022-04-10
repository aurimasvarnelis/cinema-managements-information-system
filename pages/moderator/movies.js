import dbConnect from '../../lib/dbConnect'
import Movie from '../../models/Movie'
import { Button, Col, Container, Row, Modal, Form, Table } from "react-bootstrap"
import { AddMovie } from "../../components/moderator/movies/AddMovie"
import { ViewMovie } from "../../components/moderator/movies/ViewMovie"
import { EditMovie } from "../../components/moderator/movies/EditMovie"
import { DeleteMovie } from "../../components/moderator/movies/DeleteMovie"

export default function movies({ movies }) {
  return (
    <>
      <Container>     
        <AddMovie />
             
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
            {/* Create a card for each movie */}
            {movies.map((movie) => (
              <tr key={movie._id} className="item-row">
                {/* <img src={movie.image_url} /> */}
                <td><embed src={movie.poster} height="100px"></embed></td>
                <td>{movie.name}</td>
                <td>{movie.premiere_date}</td>
                <td>{movie.genre}</td>

                <td>
                  <ViewMovie movie={movie}/>
                  <EditMovie movie={movie}/>
                  <DeleteMovie movie={movie}/>
                </td>
              </tr>
            ))}
          </tbody>
  
        </Table>
        
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


