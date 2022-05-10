import { Button, Card, Col, Container, Form, Modal, ProgressBar, Row, Tab, Table, Tabs } from "react-bootstrap";
import { GenresDoughnutChart, RatingsDoughnutChart } from "../../components/charts/doughnutChart";
import { MonthlyRevenueLineChart, TicketsSoldByMovieDurationLineChart } from "../../components/charts/lineChart";
import { RadarMonthChart, RadarTimeChart, RadarWeekdayChart } from "../../components/charts/radarChart";
import {
	getGenresPopularity,
	getMostPopularMonths,
	getMostPopularTimes,
	getMostPopularWeekdays,
	getOrdersThisWeek,
	getRatingsPopularity,
	getRevenueOfAllMonths,
	getRevenueThisWeek,
	getTicketsSoldByMovieDuration,
	getUsersThisMonth,
} from "../../controllers/dashboardController";

import dbConnect from "../../lib/dbConnect";
import { getCinemasByManager } from "../../controllers/cinemaController";
import { getSession } from "next-auth/react";
import styles from "./dashboard.module.scss";
import { useEffect } from "react";

export default function dashboard({
	cinemas,
	usersThisMonth,
	ordersThisWeek,
	revenueThisWeek,
	revenueOfAllMonths,
	mostPopularTimes,
	mostPopularWeekdays,
	mostPopularMonths,
	genresPopularity,
	ratingsPopularity,
	ticketsSoldByMovieDuration,
}) {
	console.log(ticketsSoldByMovieDuration);

	const dynamicColors = () => {
		var r = Math.floor(Math.random() * 255);
		var g = Math.floor(Math.random() * 255);
		var b = Math.floor(Math.random() * 255);
		return r + "," + g + "," + b;
	};

	const colors = cinemas.map((cinema, idx) => {
		return dynamicColors();
	});

	return (
		<>
			<Container>
				<Row className={styles.row}>
					<Col className={styles.col}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h4>Orders this week</h4>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								{ordersThisWeek.map((order, idx) => {
									return (
										<div key={idx} className={styles.cinemaList}>
											<div>{cinemas[idx].name}</div>
											<div className={styles.cinemaNumbers}>
												{order.ordersThisWeek}
												{order.changePercent > 0 ? (
													<div className={styles.green}>+{order.changePercent}%</div>
												) : order.changePercent < 0 ? (
													<div className={styles.red}>{order.changePercent}%</div>
												) : (
													<div className={styles.grey}>+{order.changePercent}%</div>
												)}
											</div>
										</div>
									);
								})}
							</Card.Body>
						</Card>
					</Col>
					<Col className={styles.col}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h4>Revenue this week</h4>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								{revenueThisWeek.map((order, idx) => {
									return (
										<div key={idx} className={styles.cinemaList}>
											<div>{cinemas[idx].name}</div>
											<div className={styles.cinemaNumbers}>
												${order.revenueThisWeek}
												{order.changePercent > 0 ? (
													<div className={styles.green}>+{order.changePercent}%</div>
												) : order.changePercent < 0 ? (
													<div className={styles.red}>{order.changePercent}%</div>
												) : (
													<div className={styles.grey}>+{order.changePercent}%</div>
												)}
											</div>
										</div>
									);
								})}
							</Card.Body>
						</Card>
					</Col>
					<Col className={styles.col}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h4>Users this month</h4>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								{usersThisMonth.map((order, idx) => {
									return (
										<div key={idx} className={styles.cinemaList}>
											<div>{cinemas[idx].name}</div>
											<div className={styles.cinemaNumbers}>
												{order.usersThisMonth}
												{order.changePercent > 0 ? (
													<div className={styles.green}>+{order.changePercent}%</div>
												) : order.changePercent < 0 ? (
													<div className={styles.red}>{order.changePercent}%</div>
												) : (
													<div className={styles.grey}>+{order.changePercent}%</div>
												)}
											</div>
										</div>
									);
								})}
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row className={styles.row}>
					<Col className={styles.col} sm={6} md={6} lg={4}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h4>Revenue by month</h4>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<MonthlyRevenueLineChart chartData={revenueOfAllMonths} cinemas={cinemas} colors={colors} />
							</Card.Body>
						</Card>
					</Col>
					<Col className={styles.col} sm={6} md={6} lg={4}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h4>Tickets sold by movie duration</h4>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<TicketsSoldByMovieDurationLineChart chartData={ticketsSoldByMovieDuration} cinemas={cinemas} colors={colors} />
							</Card.Body>
						</Card>
					</Col>
					<Col className={styles.col} sm={6} md={6} lg={4}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h4>Popular times</h4>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<RadarTimeChart chartData={mostPopularTimes} cinemas={cinemas} colors={colors} />
							</Card.Body>
						</Card>
					</Col>
					<Col className={styles.col} sm={6} md={6} lg={4}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h4>Popular weekdays</h4>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<RadarWeekdayChart chartData={mostPopularWeekdays} cinemas={cinemas} colors={colors} />
							</Card.Body>
						</Card>
					</Col>
					<Col className={styles.col} sm={6} md={6} lg={4}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h4>Popular months</h4>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<RadarMonthChart chartData={mostPopularMonths} cinemas={cinemas} colors={colors} />
							</Card.Body>
						</Card>
					</Col>
					<Col className={styles.col} sm={6} md={6} lg={4}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h4>Genres popularity</h4>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<GenresDoughnutChart chartData={genresPopularity} cinemas={cinemas} />
							</Card.Body>
						</Card>
					</Col>
					<Col className={styles.col} sm={6} md={6} lg={4}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h4>Ratings popularity</h4>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<GenresDoughnutChart chartData={ratingsPopularity} cinemas={cinemas} />
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export async function getServerSideProps(context) {
	await dbConnect();

	const { user } = await getSession(context);
	const cinemas = await getCinemasByManager(user.id);

	const usersThisMonth = await Promise.all(
		cinemas.map(async (cinema) => {
			const usersThisMonth = await getUsersThisMonth(cinema._id);
			return usersThisMonth;
		})
	);

	const ordersThisWeek = await Promise.all(
		cinemas.map(async (cinema) => {
			const ordersThisWeek = await getOrdersThisWeek(cinema._id);
			return ordersThisWeek;
		})
	);

	const revenueThisWeek = await Promise.all(
		cinemas.map(async (cinema) => {
			const revenueThisWeek = await getRevenueThisWeek(cinema._id);
			return revenueThisWeek;
		})
	);

	const revenueOfAllMonths = await Promise.all(
		cinemas.map(async (cinema) => {
			const revenueOfAllMonths = await getRevenueOfAllMonths(cinema._id);
			return revenueOfAllMonths;
		})
	);

	const mostPopularTimes = await Promise.all(
		cinemas.map(async (cinema) => {
			const mostPopularTimes = await getMostPopularTimes(cinema._id);
			return mostPopularTimes;
		})
	);

	const mostPopularWeekdays = await Promise.all(
		cinemas.map(async (cinema) => {
			const mostPopularWeekdays = await getMostPopularWeekdays(cinema._id);
			return mostPopularWeekdays;
		})
	);

	const mostPopularMonths = await Promise.all(
		cinemas.map(async (cinema) => {
			const mostPopularMonths = await getMostPopularMonths(cinema._id);
			return mostPopularMonths;
		})
	);

	const genresPopularity = await Promise.all(
		cinemas.map(async (cinema) => {
			const genresPopularity = await getGenresPopularity(cinema._id);
			return genresPopularity;
		})
	);

	const ratingsPopularity = await Promise.all(
		cinemas.map(async (cinema) => {
			const ratingsPopularity = await getRatingsPopularity(cinema._id);
			return ratingsPopularity;
		})
	);

	const ticketsSoldByMovieDuration = await Promise.all(
		cinemas.map(async (cinema) => {
			const ticketsSoldByMovieDuration = await getTicketsSoldByMovieDuration(cinema._id);
			return ticketsSoldByMovieDuration;
		})
	);

	return {
		props: {
			cinemas: JSON.parse(JSON.stringify(cinemas)),
			usersThisMonth: JSON.parse(JSON.stringify(usersThisMonth)),
			ordersThisWeek: JSON.parse(JSON.stringify(ordersThisWeek)),
			revenueThisWeek: JSON.parse(JSON.stringify(revenueThisWeek)),
			revenueOfAllMonths: JSON.parse(JSON.stringify(revenueOfAllMonths)),
			mostPopularTimes: JSON.parse(JSON.stringify(mostPopularTimes)),
			mostPopularWeekdays: JSON.parse(JSON.stringify(mostPopularWeekdays)),
			mostPopularMonths: JSON.parse(JSON.stringify(mostPopularMonths)),
			genresPopularity: JSON.parse(JSON.stringify(genresPopularity)),
			ratingsPopularity: JSON.parse(JSON.stringify(ratingsPopularity)),
			ticketsSoldByMovieDuration: JSON.parse(JSON.stringify(ticketsSoldByMovieDuration)),
		},
	};
}
