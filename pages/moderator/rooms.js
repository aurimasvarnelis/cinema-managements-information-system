import Layout from "../../components/layout"
import dbConnect from '../../lib/dbConnect'
//import Room from '../../models/Room'
import { Button, Col, Container, Row, Modal, Form, Table } from "react-bootstrap"
import { useState } from 'react'
// import { AddRoom } from "../../components/admin/rooms/AddRoom"
// import { ViewRoom } from "../../components/admin/rooms/ViewRoom"
// import { EditRoom } from "../../components/admin/rooms/EditRoom"
// import { DeleteRoom } from "../../components/admin/rooms/DeleteRoom"

export default function rooms({ rooms }) {
  return (
    <>
      <Container>
        {/* <AddRoom /> */}

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
                  {room.location}
                </td>

                <td>
                  {/* <ViewRoom room={room}/>
                  <EditRoom room={room}/>
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

/* Retrieves room(s) data from mongodb database */
export async function getServerSideProps() {
  await dbConnect()

  /* find all the data in our database */
  const result = await Room.find({})
  const rooms = result.map((doc) => {
    const room = doc.toObject()
    room._id = room._id.toString()
    return room
  })

  return { props: { rooms: rooms } }
}