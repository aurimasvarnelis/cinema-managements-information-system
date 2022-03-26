import Link from "next/link"
// import dbConnect from '../lib/dbConnect'
// import Cinema from '../models/Cinema'
import Image from 'next/image'
import { signIn, signOut, useSession } from "next-auth/react"
import Logo from '../public/raqua-cinema.png'
import { Navbar, Container, Nav, NavDropdown, DropdownButton, Dropdown } from 'react-bootstrap'
import styles from "./header.module.css"
import { useRouter } from "next/router";
import Login from '../components/login'
import Logout from '../components/logout'
import { setCookies, getCookie } from 'cookies-next';
import { useState, useEffect } from 'react'
import { render } from "react-dom"
import {atom, selector, useRecoilState} from 'recoil';
import { cinemaState } from "../atoms/cinemaAtom";
//import { getCinemas } from "../controllers/cinemaController"
import axios from "axios"

export default function Header() {
  const { data: session, status } = useSession()

  const router = useRouter();

  const [cinema, setCinema] = useRecoilState(cinemaState);
  const [cinemas, setCinemas] = useState();

  useEffect(() => {
    //const MONGODB_URI = process.env.NODE_ENV.MONGODB_URI;
    //console.log(MONGODB_URI)
    setCinema(getCookie('cinema')) 
    fetch(`http://localhost:3000/api/cinemas`)
      .then((res) => res.json(res))
      .then((data) => {
        setCinemas(data)
      }) 
  });

  // console.log({session, status})
  // if (status === "loading") {
  //   return <></>;
  // }

  const handleTheaterSelect = (data) => {
    setCinema(data);
    setCookies("cinema", data);
    //router.push("/")
  };
  
  return (
    <header>
      <Container>
        <Navbar className="navbar-custom" expand="lg">
          <Navbar.Brand>
            <Image
              src={Logo}
              width="120"
              height="120"
              alt="filmTheaterLogo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="nav-custom me-auto">
              {!session 
                ?
                  <>
                    <Link href="/" passHref >
                      <Nav.Link className={router.asPath == "/" ? "active" : ""}>Home</Nav.Link> 
                    </Link>
                    <Link href="/movies" passHref >
                      <Nav.Link className={router.asPath == "/movies" ? "active" : ""}>Movies</Nav.Link> 
                    </Link>
                    <Link href="/cinemas" passHref>
                      <Nav.Link className={router.asPath == "/cinemas" ? "active" : ""}>Theaters</Nav.Link>
                    </Link>
                  </>
                :
               <>
                  {session != "undefined" &&(
                    <>
                      {!session || session.user.role == "user" &&(
                        <>
                          <Link href="/" passHref >
                            <Nav.Link className={router.asPath == "/" ? "active" : ""}>Home</Nav.Link> 
                          </Link>
                          <Link href="/movies" passHref >
                            <Nav.Link className={router.asPath == "/movies" ? "active" : ""}>Movies</Nav.Link> 
                          </Link>
                          <Link href="/cinemas" passHref>
                            <Nav.Link className={router.asPath == "/cinemas" ? "active" : ""}>Theaters</Nav.Link>
                          </Link>
                        </>
                      )
                      }
                      {session.user.role == "moderator" &&(
                        <>
                          <Link href="/moderator/movies" passHref >
                            <Nav.Link className={router.asPath == "/moderator/movies" ? "active" : ""}>(M)Movies</Nav.Link> 
                          </Link>
                          <Link href="/moderator/rooms" passHref >
                            <Nav.Link className={router.asPath == "/moderator/rooms" ? "active" : ""}>(M)Rooms</Nav.Link> 
                          </Link>
                          <Link href="/moderator/sessions" passHref >
                            <Nav.Link className={router.asPath == "/moderator/sessions" ? "active" : ""}>(M)Sessions</Nav.Link> 
                          </Link>
                        </>
                      )
                      }
                      {session.user.role == "admin" &&(
                        <>
                          <Link href="/admin/cinemas" passHref>
                            <Nav.Link className={router.asPath == "/admin/cinemas" ? "active" : ""}>(A)Cinemas</Nav.Link>
                          </Link>
                          <Link href="/admin/users" passHref>
                            <Nav.Link className={router.asPath == "/admin/users" ? "active" : ""}>(A)Users</Nav.Link>
                          </Link>
                        </>
                      )
                      }
                    </>            
                  ) 
                  }
               </>     
              }     

            </Nav>
            <Nav className="nav-custom">
            
              <DropdownButton title={cinema} id="theater-dropdown-menu" onSelect={handleTheaterSelect}>
                {cinemas &&
                  cinemas.map((cinema) => (
                    <Dropdown.Item key={cinema._id} eventKey={cinema.name}>{cinema.name} | {cinema.location}</Dropdown.Item>
                  ))
                }
              </DropdownButton>     
              {session
              ? <Logout />
              : <Login />     
            }        
            </Nav>
          </Navbar.Collapse>   
        </Navbar>
      </Container>
   
    </header>
  )
}