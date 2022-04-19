import {
	Container,
	Dropdown,
	DropdownButton,
	Nav,
	NavDropdown,
	Navbar,
} from "react-bootstrap";
import { getCookie, setCookies } from "cookies-next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import Login from "./auth/login";
import Logo from "../public/sus-cinema-2.png";
import Logout from "./auth/logout";
import { cinemaState } from "../atoms/cinemaAtom";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";

// import styles from "./header.module.css";

export default function Header() {
	const { data: session, status } = useSession();

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

	// console.log({session, status})
	// if (status === "loading") {
	//   return <></>;
	// }

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
						<Image src={Logo} width="120" height="120" alt="filmCinemaLogo" />
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="nav-custom me-auto">
							{!session ? (
								<>
									<Link href="/" passHref>
										<Nav.Link className={router.asPath == "/" ? "active" : ""}>
											Home
										</Nav.Link>
									</Link>
									<Link href="/movies" passHref>
										<Nav.Link
											className={router.asPath == "/movies" ? "active" : ""}
										>
											Movies
										</Nav.Link>
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
															<Nav.Link
																className={router.asPath == "/" ? "active" : ""}
															>
																Home
															</Nav.Link>
														</Link>
														<Link href="/movies" passHref>
															<Nav.Link
																className={
																	router.asPath == "/movies" ? "active" : ""
																}
															>
																Movies
															</Nav.Link>
														</Link>
													</>
												))}
											{session.user.role == "moderator" && (
												<>
													<Link href="/moderator/movies" passHref>
														<Nav.Link
															className={
																router.asPath == "/moderator/movies"
																	? "active"
																	: ""
															}
														>
															(M)Movies
														</Nav.Link>
													</Link>
													<Link href="/moderator/rooms" passHref>
														<Nav.Link
															className={
																router.asPath == "/moderator/rooms"
																	? "active"
																	: ""
															}
														>
															(M)Rooms
														</Nav.Link>
													</Link>
													<Link href="/moderator/sessions" passHref>
														<Nav.Link
															className={
																router.asPath == "/moderator/sessions"
																	? "active"
																	: ""
															}
														>
															(M)Sessions
														</Nav.Link>
													</Link>
												</>
											)}
											{session.user.role == "admin" && (
												<>
													<Link href="/admin/cinemas" passHref>
														<Nav.Link
															className={
																router.asPath == "/admin/cinemas"
																	? "active"
																	: ""
															}
														>
															(A)Cinemas
														</Nav.Link>
													</Link>
													<Link href="/admin/users" passHref>
														<Nav.Link
															className={
																router.asPath == "/admin/users" ? "active" : ""
															}
														>
															(A)Users
														</Nav.Link>
													</Link>
												</>
											)}
										</>
									)}
								</>
							)}
						</Nav>
						<Nav className="nav-custom">
							<DropdownButton
								title={cinema}
								className="cinema-dropdown-button"
								onSelect={handleCinemaSelect}
							>
								{cinemas &&
									cinemas.map((cinema) => (
										<Dropdown.Item key={cinema._id} eventKey={cinema._id}>
											{cinema.name} | {cinema.location}
										</Dropdown.Item>
									))}
							</DropdownButton>
							{session ? (
								<DropdownButton
									title="Profile"
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
