import { Button, Card, Col, Container, Form, Modal, Row, Stack, Table } from "react-bootstrap";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import DatePicker from "react-datepicker";
import Image from "next/image";
import armchairEmpty from "../../public/images/armchair-seat-empty.svg";
import armchairGreen from "../../public/images/armchair-seat-green.svg";
import armchairRed from "../../public/images/armchair-seat-red.svg";
import armchairYellow from "../../public/images/armchair-seat-yellow.svg";
import dbConnect from "../../lib/dbConnect";
import { getCinema } from "../../controllers/cinemaController";
import { getCookie } from "cookies-next";
import { getCurrentUserOrder } from "../../controllers/orderController";
import { getMovie } from "../../controllers/movieController";
import { getMovieSession } from "../../controllers/sessionController";
import moment from "moment";
import styles from "./[sessionId].module.scss";
import { useRouter } from "next/router";

export default function Session({ movieSession, movie, cinema, order }) {
	const router = useRouter();
	const refreshData = () => router.replace(router.asPath);

	const addTicketToOrder = async (ticket) => {
		const response = await fetch(`/api/orders/select-seat`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_id: order.user_id,
				session_id: movieSession._id,
				ticket,
			}),
		})
			.then((res) => res.json(res))
			.then((data) => {
				console.log(data);
				if (data.error) {
					movieSession.room = data.session.room;
					refreshData();
					alert(data.error);
				} else {
					movieSession.room = data.session.room;
					order.tickets = data.order.tickets;
					refreshData();
				}
			});
	};

	const removeTicketFromOrder = async (ticket) => {
		const response = await fetch(`/api/orders/deselect-seat`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_id: order.user_id,
				session_id: movieSession._id,
				ticket,
			}),
		})
			.then((res) => res.json(res))
			.then((data) => {
				console.log(data);
				if (data.error) {
					movieSession.room = data.session.room;
					refreshData();
					alert(data.error);
				} else {
					movieSession.room = data.session.room;
					order.tickets = data.order.tickets;
					refreshData();
				}
			});
	};

	const handleSelectTicket = async (rowIndex, columnIndex, ticketType) => {
		const newTicket = {
			row_index: rowIndex,
			column_index: columnIndex,
			ticket_type_name: ticketType.ticket_type_name,
			price: ticketType.price,
		};
		await addTicketToOrder(newTicket);
	};

	const handleDeselectTicket = async (rowIndex, columnIndex) => {
		const removeTicket = order.tickets.find((ticket) => ticket.row_index === rowIndex && ticket.column_index === columnIndex);
		await removeTicketFromOrder(removeTicket);
	};

	const handleSubmitOrder = async () => {
		const response = await fetch(`/api/orders/submit-order`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				orderId: order._id,
			}),
		})
			.then((res) => res.json(res))
			.then((data) => {
				console.log(data);
				refreshData();
				// if (data.error) {
				// 	movieSession.room = data.session.room;
				// 	refreshData();
				// 	alert(data.error);
				// 	// alert("Order failed!")
				// } else {
				// 	movieSession.room = data.session.room;
				// 	order.tickets = data.order.tickets;
				// 	refreshData();
				// 	alert("Order placed successfully!");
				// }
			});
	};

	return (
		<Container>
			<Row style={{ justifyContent: "center" }}>
				<Col xs={12} md={10} lg={8} xl={8}>
					<h1>{movie.name}</h1>
					<div>{moment(movieSession.start_time).format("MMMM DD, YYYY")}</div>
					<div>{movieSession.display_time}</div>
					<div>
						{cinema.name}, {movieSession.room.name}
					</div>
				</Col>
			</Row>
			<Row className={styles.seating}>
				<div>
					{movieSession.room.rows
						.map((row, rowIndex) => (
							<div className={styles.seatRow} key={rowIndex}>
								<div className={styles.rowIndexNumber}>{rowIndex + 1}</div>
								{row.columns.map((column, columnIndex) => (
									<div className={styles.seatColumn} key={columnIndex}>
										{column.status === -1 ? (
											<Image src={armchairEmpty} width="100%" height="100%" alt="empty" />
										) : column.status === 0 ? (
											<Image
												src={armchairGreen}
												width="100%"
												height="100%"
												alt="green"
												onClick={() => {
													// only works with standard ticket type
													handleSelectTicket(rowIndex, columnIndex, movieSession.ticket_types[0]);
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
											<Image src={armchairRed} width="100%" height="100%" alt="red" />
										)}
									</div>
								))}
							</div>
						))
						.reverse()}
				</div>
			</Row>
			<Row xs={12} sm={6} md={3} lg={3} xl={3} style={{ justifyContent: "center" }}>
				<Col className={styles.ticketTypeColumn}>
					<ul className={styles.ticketTypesList}>
						{
							movieSession.ticket_types
								.map((ticketType, index) => (
									<li key={index}>
										<div className={styles.armchairBlock}>
											{index === 0 && (
												<div className={styles.armchairType}>
													<Image src={armchairGreen} width="100%" height="100%" alt="green" />
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
									<Image src={armchairYellow} width="100%" height="100%" alt="yellow" />
								</div>
								<div>Selected</div>
							</div>
						</li>
						<li>
							<div className={styles.armchairBlock}>
								<div className={styles.armchairType}>
									<Image src={armchairRed} width="100%" height="100%" alt="red" />
								</div>
								<div>Unavailable</div>
							</div>
						</li>
					</ul>
				</Col>
			</Row>

			{order.tickets.length === 0 && (
				<Row className={styles.ticketRow}>
					<Col xs={12} md={10} lg={8} xl={8} className={styles.ticketColumn}>
						<div className={styles.ticketSeating}>No ticket selected</div>
						<div className={styles.ticketType}></div>
						<div className={styles.ticketPrice}></div>
					</Col>
				</Row>
			)}

			{/* map through all tickets and display row, column, ticket_type_name, price  */}
			{order.tickets.map((ticket, ticketIndex) => (
				<Row key={ticketIndex} className={styles.ticketRow}>
					<Col xs={12} md={10} lg={8} xl={8} className={styles.ticketColumn}>
						<div className={styles.ticketSeating}>
							Row: {ticket.row_index + 1}, Seat: {ticket.column_index + 1}
						</div>
						<div className={styles.ticketType}>Ticket type: {ticket.ticket_type_name}</div>
						<div className={styles.ticketPrice}>${parseFloat(ticket.price).toFixed(2)}</div>
					</Col>
				</Row>
			))}

			<Row className={styles.ticketRow}>
				<Col xs={12} md={10} lg={8} xl={8} className={styles.ticketsTotal}>
					<div className={styles.ticketTotal}>Total:</div>
					<div className={styles.ticketPrice}>${parseFloat(movieSession.ticket_types[0].price * order.tickets.length).toFixed(2)}</div>
				</Col>
			</Row>
			<Row>
				<Col className={styles.submit}>
					<Button
						onClick={() => {
							handleSubmitOrder();
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
	const session = await getMovieSession(sessionId);
	const movie = await getMovie(session.movie_id);
	const cinema = await getCinema(session.cinema_id);
	const userSession = await getSession(context);
	const order = await getCurrentUserOrder(userSession.user.id, session.cinema_id, sessionId, session.movie_id);

	return {
		props: {
			movieSession: JSON.parse(JSON.stringify(session)),
			movie: JSON.parse(JSON.stringify(movie)),
			cinema: JSON.parse(JSON.stringify(cinema)),
			order: JSON.parse(JSON.stringify(order)),
		},
	};
}
