import dbConnect from '../../lib/dbConnect'
//import Room from '../../models/Room'
import { Button, Col, Container, Row, Modal, Form, Table } from "react-bootstrap"
import { useEffect, useState } from 'react'
import { AddRoom } from "../../components/moderator/rooms/AddRoom"
import { ViewRoom } from "../../components/moderator/rooms/ViewRoom"
// import { EditRoom } from "../../components/admin/movies/EditRoom"
// import { DeleteRoom } from "../../components/admin/movies/DeleteRoom"
import { getRooms } from "../../controllers/roomController"
import { setCookies, getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { atom, selector, useRecoilState } from 'recoil';

export default function Rooms({ rooms }) {
  const router = useRouter()

  //const refreshData = () => router.replace(router.asPath);
  
  //const [cinema, setCinema] = useRecoilState(cinemaState);
  
  // useEffect(() => {
  //   fetch('http://localhost:3000/api/cinemas')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       rooms = data;
  //     })
  // }, [rooms])

  return (
    <>
      <Container>
        <AddRoom />

        <Table striped bordered hover>
          <thead>
            <tr>  
              <th>Name</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id} className="item-row">
                <td>{room.name}</td>

                <td>
                  {room.cinema_id}
                </td>

                <td>
                  <ViewRoom room={room}/>
                  {/* <EditRoom room={room}/>
                  <DeleteRoom room={room} /> */}
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
  const data = await getRooms(cinemaId)

  return { 
    props: { 
      rooms: JSON.parse(JSON.stringify(data)) 
    } 
  }
}