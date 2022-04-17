import {
	Button,
	Card,
	Col,
	Container,
	Form,
	Modal,
	Row,
	Stack,
	Table,
} from "react-bootstrap";
import { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import Image from "next/image";
import armchairEmpty from "../../public/images/armchair-seat-empty.svg";
import armchairGreen from "../../public/images/armchair-seat-green.svg";
import armchairRed from "../../public/images/armchair-seat-red.svg";
import armchairYellow from "../../public/images/armchair-seat-yellow.svg";
import dbConnect from "../../lib/dbConnect";
import { getCinema } from "../../controllers/cinemaController";
import { getCookie } from "cookies-next";
import { getMovie } from "../../controllers/movieController";
import { getSession } from "../../controllers/sessionController";
import moment from "moment";
import styles from "./[sessionId].module.scss";
import { useRouter } from "next/router";

export default function Session({ movieSession, movie, cinema }) {
	//console.log(movieSession.room);

	const router = useRouter();
	const refreshData = () => {
		router.replace(router.asPath);
	};

	// fetch session from api
	const [session, setSession] = useState(movieSession);

	async function fetchSession() {
		const response = await fetch(
			`${process.env.url}/api/sessions/${movieSession._id}`
		)
			.then((res) => res.json(res))
			.then((data) => {
				setSession(data);
			});
		//refreshData();
		console.log(movieSession);
	}

	// tickets state for multiple tickets
	const [tickets, setTickets] = useState([]);

	const handleSelectTicket = (rowIndex, columnIndex, ticketType) => {
		// store rowIndex, columnIndex, ticket_type in tickets array
		const newTicket = {
			rowIndex,
			columnIndex,
			ticket_type_name: ticketType.ticket_type_name,
			price: ticketType.price,
		};
		setTickets([...tickets, newTicket]);

		movieSession.room.rows[rowIndex].columns[columnIndex].status = 1;

		fetchSession();

		console.log(tickets);
	};

	const handleDeselectTicket = (rowIndex, columnIndex) => {
		// remove rowIndex, columnIndex from tickets array
		const newTickets = tickets.filter(
			(ticket) =>
				ticket.rowIndex !== rowIndex || ticket.columnIndex !== columnIndex
		);
		setTickets(newTickets);

		movieSession.room.rows[rowIndex].columns[columnIndex].status = 0;

		fetchSession();

		console.log(tickets);
	};

	// useEffect(() => {
	// 	fetchSession();
	// }, [movieSession]);

	return (
		<Container>
			<Row>
				<div>
					<h1>{movie.name}</h1>
					<h3>{moment(movieSession.start_time).format("MMMM DD, YYYY")}</h3>
					<h3>{movieSession.display_time}</h3>
					<h3>
						{cinema.name}, {movieSession.room.name}
					</h3>
				</div>
			</Row>
			<Row className={styles.seating}>
				<div>
					{/* map through movieSession.room rows and columns and display armchair for each column*/}
					{movieSession.room.rows
						.map((row, rowIndex) => (
							<div className={styles.seatRow} key={rowIndex}>
								<div className={styles.rowIndexNumber}>{rowIndex + 1}</div>
								{row.columns.map((column, columnIndex) => (
									<div className={styles.seatColumn} key={columnIndex}>
										{column.status === -1 ? (
											<Image
												src={armchairEmpty}
												width="100%"
												height="100%"
												alt="empty"
											/>
										) : column.status === 0 ? (
											<Image
												src={armchairGreen}
												width="100%"
												height="100%"
												alt="green"
												onClick={() => {
													// ??????????
													// if (column.status === 0) {
													// 	row.columns[columnIndex].status = 1;
													// 	fetchSession();
													// }

													// only works with standard ticket type
													handleSelectTicket(
														rowIndex,
														columnIndex,
														movieSession.ticket_types[0]
													);
												}}
											/>
										) : column.status === 1 ? (
											<Image
												src={armchairYellow}
												width="100%"
												height="100%"
												alt="yellow"
												onClick={() => {
													handleDeselectTicket(rowIndex, columnIndex);
												}}
											/>
										) : (
											<Image
												src={armchairRed}
												width="100%"
												height="100%"
												alt="red"
											/>
										)}
									</div>
								))}
							</div>
						))
						.reverse()}
				</div>
			</Row>
			<Row
				xs={12}
				sm={6}
				md={3}
				lg={3}
				xl={3}
				style={{ justifyContent: "center" }}
			>
				<Col className={styles.ticketTypeColumn}>
					<ul className={styles.ticketTypesList}>
						{/* // map through ticket_types and display each ticket type as <li> */}
						{
							movieSession.ticket_types
								.map((ticketType, index) => (
									<li key={index}>
										<div className={styles.armchairBlock}>
											{/* if index = 0 display Image */}
											{index === 0 && (
												<div className={styles.armchairType}>
													<Image
														src={armchairGreen}
														width="100%"
														height="100%"
														alt="green"
													/>
												</div>
											)}
											<div>
												<div>{ticketType.ticket_type_name}</div>
												<div>${ticketType.price}</div>
											</div>
										</div>
									</li>
								)) // only one value in array
								.values()
								.next().value
						}
					</ul>
				</Col>
				<Col className={styles.ticketTypeColumn}>
					{/* list armchair types as <ul> list with image and name*/}
					<ul className={styles.armchairTypesList}>
						<li>
							<div className={styles.armchairBlock}>
								<div className={styles.armchairType}>
									<Image
										src={armchairYellow}
										width="100%"
										height="100%"
										alt="yellow"
									/>
								</div>
								<div>Selected</div>
							</div>
						</li>
						<li>
							<div className={styles.armchairBlock}>
								<div className={styles.armchairType}>
									<Image
										src={armchairRed}
										width="100%"
										height="100%"
										alt="red"
									/>
								</div>
								<div>Sold</div>
							</div>
						</li>
					</ul>
				</Col>
			</Row>

			{/* map through all tickets and display row, column, ticket_type_name, price  */}
			{tickets.map((ticket, ticketIndex) => (
				<Row key={ticketIndex} className={styles.ticketRow}>
					<Col xs={12} md={10} lg={8} xl={8} className={styles.ticketColumn}>
						<div className={styles.ticketSeating}>
							Row: {ticket.rowIndex + 1}, Seat: {ticket.columnIndex + 1}
						</div>
						<div className={styles.ticketType}>
							Ticket type: {ticket.ticket_type_name}
						</div>
						<div className={styles.ticketPrice}>${ticket.price}</div>
					</Col>
				</Row>
			))}

			<Row className={styles.ticketRow}>
				<Col xs={12} md={10} lg={8} xl={8} className={styles.ticketsTotal}>
					<div className={styles.ticketTotal}>Total:</div>
					<div className={styles.ticketPrice}>
						${movieSession.ticket_types[0].price * tickets.length}
					</div>
				</Col>
			</Row>
			<Row>
				<Col className={styles.submit}>
					<Button
						onClick={() => {
							handleSubmitTickets();
						}}
					>
						Submit Order
					</Button>
				</Col>
			</Row>
		</Container>
	);
}

export async function getServerSideProps(context) {
	await dbConnect();

	const { sessionId } = context.query;
	const session = await getSession(sessionId);
	const movie = await getMovie(session.movie_id);
	const cinema = await getCinema(session.room.cinema_id);

	return {
		props: {
			movieSession: JSON.parse(JSON.stringify(session)),
			movie: JSON.parse(JSON.stringify(movie)),
			cinema: JSON.parse(JSON.stringify(cinema)),
		},
	};
}
