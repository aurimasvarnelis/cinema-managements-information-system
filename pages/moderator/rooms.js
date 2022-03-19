import Layout from "../../components/layout"
import dbConnect from '../../lib/dbConnect'
import Cinema from '../../models/Cinema'
import { Button, Col, Container, Row, Modal, Form, Table } from "react-bootstrap"
import { useState } from 'react'
// import { AddCinema } from "../../components/admin/cinemas/AddCinema"
// import { ViewCinema } from "../../components/admin/cinemas/ViewCinema"
// import { EditCinema } from "../../components/admin/cinemas/EditCinema"
// import { DeleteCinema } from "../../components/admin/cinemas/DeleteCinema"

export default function rooms({ cinemas }) {
  return (
    <Layout>
      <Container>
        
      </Container>
    </Layout>
  )
}

/* Retrieves cinema(s) data from mongodb database */
export async function getServerSideProps() {
  await dbConnect()

  /* find all the data in our database */
  const result = await Cinema.find({})
  const cinemas = result.map((doc) => {
    const cinema = doc.toObject()
    cinema._id = cinema._id.toString()
    return cinema
  })

  return { props: { cinemas: cinemas } }
}