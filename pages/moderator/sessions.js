import dbConnect from '../../lib/dbConnect'
import { Button, Col, Container, Row, Modal, Form, Table } from "react-bootstrap"
import { AddSession } from "../../components/moderator/sessions/AddSession"
import { ViewSession } from "../../components/moderator/sessions/ViewSession"
import { EditSession } from "../../components/moderator/sessions/EditSession"
import { DeleteSession } from "../../components/moderator/sessions/DeleteSession"
import { getSessions } from "../../controllers/sessionController"
import { getRooms } from "../../controllers/roomController"
import { getMovies } from "../../controllers/movieController"
import { getCookie } from 'cookies-next';

export default function Sessions({ sessions, movies, rooms, cinemaId }) {

  return (
    <>
      <Container>
        <AddSession movies={movies} rooms={rooms} cinemaId={cinemaId}/>

        <Table striped bordered hover>
          <thead>
            <tr>  
              <th>Movie</th>
              <th>Room</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {sessions.map((session) => {
            const movie = movies.find(movie => movie._id === session.movie_id)
            const room = rooms.find(room => room._id === session.room_id)
            return(
              <tr key={session._id} className="item-row">            
                <td>{movie.name}</td>
                <td>{room.name}</td>
                <td>{session.display_time}</td>
                <td>{session.status}</td>
                <td>
                  <ViewSession session={session} movie={movie} room={room}/>
                  <EditSession session={session} movies={movies} rooms={rooms} movie={movie}/>
                  <DeleteSession session={session} />
                </td>
              </tr>
            )
            })
          }           
          </tbody>
        </Table>
        
      </Container>
    </>
  )
}

export async function getServerSideProps({ req, res }) {
  await dbConnect()

  const cinemaId = getCookie('cinemaId', { req, res })
  
  const sessions = await getSessions(cinemaId)
  const movies = await getMovies()
  const rooms = await getRooms(cinemaId)

  return { 
    props: { 
      sessions: JSON.parse(JSON.stringify(sessions)),
      movies: JSON.parse(JSON.stringify(movies)),
      rooms: JSON.parse(JSON.stringify(rooms)),
      cinemaId: cinemaId,
    } 
  }
}