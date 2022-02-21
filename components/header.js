import Link from "next/link"
import Image from 'next/image'
import { signIn, signOut, useSession } from "next-auth/react"
import Logo from '../public/raqua-cinema.png'
import { Navbar, Container, Nav, NavDropdown, DropdownButton, Dropdown } from 'react-bootstrap'
import styles from "./header.module.css"
import { useRouter } from "next/router";
import Login from '../components/login'
import Logout from '../components/logout'

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session } = useSession()

  const router = useRouter();

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
              <Link href="/" passHref >
                <Nav.Link className={router.asPath == "/" ? "active" : ""}>Home</Nav.Link> 
              </Link>
              <Link href="/movies" passHref >
                <Nav.Link className={router.asPath == "/movies" ? "active" : ""}>Movies</Nav.Link> 
              </Link>
              <Link href="/theaters" passHref>
                <Nav.Link className={router.asPath == "/theaters" ? "active" : ""}>Theaters</Nav.Link>
              </Link>

            </Nav>
            <Nav className="nav-custom">
              {/* <DropdownButton title="Select theater" id="theater-dropdown-menu" onSelect={handleTheaterSelect}>
                <Dropdown.Item eventKey="kaunas">Kaunas</Dropdown.Item>
                <Dropdown.Item eventKey="vilnius">Vilnius</Dropdown.Item>
              </DropdownButton>  */}   
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
