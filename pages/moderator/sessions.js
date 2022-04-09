import dbConnect from '../../lib/dbConnect'
//import Session from '../../models/Session'
import { Button, Col, Container, Row, Modal, Form, Table } from "react-bootstrap"
import { useEffect, useState } from 'react'
import { AddSession } from "../../components/moderator/sessions/AddSession"
// import { ViewSession } from "../../components/moderator/sessions/ViewSession"
// import { EditSession } from "../../components/admin/movies/EditSession"
// import { DeleteSession } from "../../components/admin/movies/DeleteSession"
import { getSessions } from "../../controllers/sessionController"
import { setCookies, getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { atom, selector, useRecoilState } from 'recoil';

export default function Sessions({ sessions }) {
  const router = useRouter()

  //const refreshData = () => router.replace(router.asPath);
  
  //const [cinema, setCinema] = useRecoilState(cinemaState);
  
  // useEffect(() => {
  //   fetch('http://localhost:3000/api/cinemas')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       sessions = data;
  //     })
  // }, [sessions])

  return (
    <>
      <Container>
        <AddSession />

        <Table striped bordered hover>
          <thead>
            <tr>  
              <th>Name</th>
              <th>Room</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session._id} className="item-row">
                <td>{session.name}</td>

                <td>
                  {session.cinema_id}
                </td>

                <td>
                  {/* <ViewSession session={session}/> */}
                  {/* <EditSession session={session}/>
                  <DeleteSession session={session} /> */}
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
  const data = await getSessions(cinemaId)

  return { 
    props: { 
      sessions: JSON.parse(JSON.stringify(data)) 
    } 
  }
}