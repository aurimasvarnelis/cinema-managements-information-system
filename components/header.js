import { Container, Dropdown, DropdownButton, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { getCookie, setCookies } from "cookies-next";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import Login from "./auth/login";
import Logo from "../public/sus-cinema-2.png";
import Logout from "./auth/logout";
import { cinemaState } from "../atoms/cinemaAtom";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

// import styles from "./header.module.css";

export default function Header() {
	const { data: session } = useSession();

	const router = useRouter();

	const [cinema, setCinema] = useRecoilState(cinemaState);
	const [cinemas, setCinemas] = useState();

	useEffect(() => {
		setCinema(getCookie("cinema"));
		const response = fetchCinemas();
	}, []);

	async function fetchCinemas() {
		//const MONGODB_URI = process.env.NODE_ENV.MONGODB_URI;
		const response = await fetch(`http://localhost:3000/api/cinemas`)
			.then((res) => res.json(res))
			.then((data) => {
				setCinemas(data);
				// const selected = data.find((e) => {
				//   return e._id === getCookie('cinema')
				// })
				// setCinema(selected.name)
			});
		return response;
	}

	const handleCinemaSelect = (data) => {
		const selected = cinemas.find((e) => {
			return e._id === data;
		});
		setCinema(selected.name);
		setCookies("cinema", selected.name);
		setCookies("cinemaId", selected._id);
		router.replace(router.asPath);
	};

	return (
		<header>
			<Container>
				<Navbar className="navbar-custom" expand="lg">
					<Navbar.Brand>
						<Image src={Logo} width="80" height="80" alt="filmCinemaLogo" />
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="nav-custom me-auto">
							{!session ? (
								<>
									<Link href="/" passHref>
										<Nav.Link className={router.asPath == "/" ? "active" : ""}>Home</Nav.Link>
									</Link>
									<Link href="/movies" passHref>
										<Nav.Link className={router.asPath == "/movies" ? "active" : ""}>Movies</Nav.Link>
									</Link>
								</>
							) : (
								<>
									{session != "undefined" && (
										<>
											{!session ||
												(session.user.role == "user" && (
													<>
														<Link href="/" passHref>
															<Nav.Link className={router.asPath == "/" ? "active" : ""}>Home</Nav.Link>
														</Link>
														<Link href="/movies" passHref>
															<Nav.Link className={router.asPath == "/movies" ? "active" : ""}>Movies</Nav.Link>
														</Link>
													</>
												))}
											{session.user.role == "manager" && (
												<>
													<Link href="/manager/dashboard" passHref>
														<Nav.Link className={router.asPath == "/manager/dashboard" ? "active" : ""}>Dashboard</Nav.Link>
													</Link>
													<Link href="/manager/all-movies" passHref>
														<Nav.Link className={router.asPath == "/manager/all-movies" ? "active" : ""}>All Movies</Nav.Link>
													</Link>
													<Link href="/manager/movies" passHref>
														<Nav.Link className={router.asPath == "/manager/movies" ? "active" : ""}>Movies</Nav.Link>
													</Link>
													<Link href="/manager/rooms" passHref>
														<Nav.Link className={router.asPath == "/manager/rooms" ? "active" : ""}>Rooms</Nav.Link>
													</Link>
													<Link href="/manager/sessions" passHref>
														<Nav.Link className={router.asPath == "/manager/sessions" ? "active" : ""}>Sessions</Nav.Link>
													</Link>
												</>
											)}
											{session.user.role == "admin" && (
												<>
													<Link href="/admin/cinemas" passHref>
														<Nav.Link className={router.asPath == "/admin/cinemas" ? "active" : ""}>Cinemas</Nav.Link>
													</Link>
													<Link href="/admin/users" passHref>
														<Nav.Link className={router.asPath == "/admin/users" ? "active" : ""}>Users</Nav.Link>
													</Link>
												</>
											)}
										</>
									)}
								</>
							)}
						</Nav>
						<Nav className="nav-custom">
							{session?.user.role !== "admin" ||
								(session?.user.role !== "manager" && (
									<DropdownButton title={cinema} className="cinema-dropdown-button" onSelect={handleCinemaSelect}>
										{cinemas &&
											cinemas.map((cinema) => (
												<Dropdown.Item key={cinema._id} eventKey={cinema._id}>
													{cinema.name} | {cinema.location}
												</Dropdown.Item>
											))}
									</DropdownButton>
								))}
							{session ? (
								<DropdownButton
									title={session.user.role === "admin" || session.user.role === "manager" ? session.user.role : "profile"}
									className="profile-dropdown-button"
								>
									<Dropdown.Item eventKey="1">View profile</Dropdown.Item>
									<Logout router={router} />
								</DropdownButton>
							) : (
								<Login />
							)}
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			</Container>
		</header>
	);
}
