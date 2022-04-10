import dbConnect from '../../lib/dbConnect'
//import Room from '../../models/Room'
import { Button, Col, Container, Row, Modal, Form, Table } from "react-bootstrap"
import { AddRoom } from "../../components/moderator/rooms/AddRoom"
import { ViewRoom } from "../../components/moderator/rooms/ViewRoom"
import { EditRoom } from "../../components/moderator/rooms/EditRoom"
import { DeleteRoom } from "../../components/moderator/rooms/DeleteRoom"
import { getRooms } from "../../controllers/roomController"
import { getCookie } from 'cookies-next';

export default function Rooms({ rooms, cinemaId }) {
  return (
    <>
      <Container>
        <AddRoom cinemaId={cinemaId}/>

        <Table striped bordered hover>
          <thead>
            <tr>  
              <th>Name</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id} className="item-row">
                <td>{room.name}</td>

                <td>
                  
                </td>

                <td>
                  <ViewRoom room={room}/>
                  <EditRoom room={room} cinemaId={cinemaId}/>
                  <DeleteRoom room={room} cinemaId={cinemaId}/>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  )
}

export async function getServerSideProps({ req, res }) {
  await dbConnect()

  const cinemaId = getCookie('cinemaId', { req, res })
  const rooms = await getRooms(cinemaId)

  return { 
    props: { 
      rooms: JSON.parse(JSON.stringify(rooms)),
      cinemaId: cinemaId,
    } 
  }
}