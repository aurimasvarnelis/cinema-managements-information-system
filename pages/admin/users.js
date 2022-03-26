import Layout from "../../components/layout"
import dbConnect from '../../lib/dbConnect'
import Link from 'next/link'
import User from '../../models/User'
import { Button, Col, Container, Row, Modal, Form, Table } from "react-bootstrap"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
//import { AddUser } from "../../components/admin/users/AddUser"
import { ViewUser } from "../../components/admin/users/ViewUser"
import { EditUser } from "../../components/admin/users/EditUser"
import { DeleteUser } from "../../components/admin/users/DeleteUser"
import { getToken } from "next-auth/jwt"
import { getSession } from "next-auth/react"

export default function users({ users }) {
  return (
    <>
      <Container>
        {/* <AddUser /> */}

        <Table striped bordered hover>
          <thead>
            <tr>  
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="item-row">
                <td>{user.name}</td>

                <td>
                  {user.email}
                </td>
                <td>
                  {user.role}
                </td>

                <td>
                  <ViewUser user={user}/>
                  <EditUser user={user}/>
                  <DeleteUser user={user} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        
      </Container>
    </>
  )
}

/* Retrieves user(s) data from mongodb database */
export async function getServerSideProps() {
  await dbConnect()

  /* find all the data in our database */
  const result = await User.find({})
  const users = result.map((doc) => {
    const user = doc.toObject()
    user._id = user._id.toString()
    return user
  })

  return { props: { users: users } }
}

