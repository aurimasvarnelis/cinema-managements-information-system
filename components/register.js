import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { Modal, Button, Form, Alert} from 'react-bootstrap';


export default function Register({handleLoginClose}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const { register, handleSubmit } = useForm();



  const onSubmit = async (e) => {
    // try{

    //   console.log(user)  
    // } catch (error) {
    //   console.log(error.message) 
    // }

    //e.preventDefault()
    //signup(e.email, e.password)
    // if(e.password !== e.passwordConfirm){
    //   return setError("Passwords do not match")
    // }
    // try{
    //   //setLoading(true)
    //   setError("")
      
    // } catch {
    //   setError("Failed to create account")
    // }


    //setLoading(false)
    //console.log(e.email);

    //handleClose()
  };

  return (
    <>
      <Button variant="link" onClick={() => {handleLoginClose();handleShow()}}>
        Sign up
      </Button>
      
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title> 
          {/* {error && <Alert variant="danger">{error}</Alert>} */}
        </Modal.Header>
        <Modal.Body> 
          <Form id="register-hook-form" onSubmit={handleSubmit(onSubmit)}>               
            <Form.Group className="mb-3" >
              <Form.Control  type="text" placeholder="Username" {...register("username")}/>
            </Form.Group>
            <Form.Group className="mb-3" >
              <Form.Control required type="email" placeholder="Email" {...register("email")}/>
            </Form.Group>
            <Form.Group className="mb-3" >
              <Form.Control  type="text" placeholder="Password" {...register("password")}/>
            </Form.Group>
            <Form.Group className="mb-3" >
              <Form.Control  type="text" placeholder="Password" {...register("passwordConfirm")}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" form="register-hook-form">
            Sign up
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
