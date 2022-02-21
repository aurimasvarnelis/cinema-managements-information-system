
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { Modal, Button, Form, Alert} from 'react-bootstrap';
import { signIn } from 'next-auth/react';

//import Register from './Register';

export default function Login() {
  const [loginShow, setLoginShow] = useState(false);
  const handleLoginClose = () => setLoginShow(false);
  const handleLoginShow = () => setLoginShow(true);

  const { register, handleSubmit } = useForm();

  const [user, setUser] = useState({})


  const onSubmit = async (e) => {
    e.preventDefault();

    signIn("google")

    // try{
     
    //   console.log(user)  
    // } catch (error) {
    //   console.log(error.message) 
    // }
  }
  const onGoogleSignIn = (e) => {
    signIn("google");
  }

  return (
    <>
      <Button onClick={handleLoginShow}>
        Sign In
      </Button>
      
      <Modal dialogClassName="modal-login" show={loginShow} onHide={handleLoginClose} centered>
        <Modal.Header closeButton>
          
        </Modal.Header>
        <Modal.Body>
          <div className="text-center social-btn">   
            <a href="#" className="btn btn-primary btn-block w-100" onClick={() => signIn("facebook")}> Sign in with <b>Facebook</b></a>
            
            <a href="#" className="btn btn-danger btn-block w-100" onClick={() => signIn("google")}> Sign in with <b>Google</b></a>
          </div>
          <div className="or my-2">
            or
          </div>
          <Form id="login-hook-form" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" >
              <Form.Control required type="email" placeholder="Email Address" {...register("email")}/>
            </Form.Group>
            <Form.Group className="mb-3" >   
              <Form.Control  type="text" placeholder="Password" {...register("password")}/>
            </Form.Group>           
          </Form>
          <div className="forgot-password w-100 d-flex small" >
            <Button variant="link">Forgot password?</Button>
          </div>
          <Button variant="primary w-100" type="submit" form="login-hook-form">
            Log in
          </Button>
          <div className="sign-up-link">
            <span>Don&apos;t have an account?</span>       
            {/* <Register handleLoginClose={handleLoginClose} /> */}
          </div>
        </Modal.Body>
          
      </Modal>
    </>
  )
}
