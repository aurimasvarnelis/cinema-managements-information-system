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
	getTicketsSoldByMovieDuration,
	getTopTotalRevenueOfAllMovies,
	getUsersThisMonth,
} from "../../controllers/dashboardController";

import dbConnect from "../../lib/dbConnect";
import { getCinemasByManager } from "../../controllers/cinemaController";
import { getSession } from "next-auth/react";
import styles from "./movies.module.scss";
import { useEffect } from "react";

// import { getGenres, getMovies, getRatings } from "../controllers/movieController";

//const { faker } = require("@faker-js/faker");

// top 10 total revenue of all movies
export default function dashboard({
	cinemas,
	usersThisMonth,
	ordersThisWeek,
	revenueOfAllMonths,
	topTotalRevenueOfAllMovies,
	mostPopularTimes,
	mostPopularWeekdays,
	mostPopularMonths,
	genresPopularity,
	ratingsPopularity,
	ticketsSoldByMovieDuration,
}) {
	console.log(usersThisMonth);
	console.log(ordersThisWeek);

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
				{/* // dashboard tab for each cinema and one tab for all cinemas */}

				<Row className={styles.row}>
					{/* display card with line graph of sold tickets this month */}
					<Col className={styles.col}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h3>Orders this week</h3>
							</Card.Header>
							<Card.Body className={styles.cardBody}>{ordersThisWeek[0].ordersThisWeek}</Card.Body>
						</Card>
					</Col>
					<Col className={styles.col}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h3>Users this month</h3>
							</Card.Header>
							<Card.Body className={styles.cardBody}>{usersThisMonth[0].usersThisMonth}</Card.Body>
						</Card>
					</Col>
					<Col className={styles.col}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h3>Order revenue by month</h3>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<MonthlyRevenueLineChart chartData={revenueOfAllMonths} cinemas={cinemas} colors={colors} />
							</Card.Body>
						</Card>
					</Col>
					<Col className={styles.col}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h3>Tickets sold and movie duration</h3>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<TicketsSoldByMovieDurationLineChart chartData={ticketsSoldByMovieDuration} cinemas={cinemas} colors={colors} />
							</Card.Body>
						</Card>
					</Col>
					{/* <Col className={styles.col}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h3>Top 10 total revenue of all movies</h3>
							</Card.Header>
							<Card.Body className={styles.cardBody}> <DoughnutChart cinemasRevenueDataFromMovies={topTotalRevenueOfAllMovies} cinemas={cinemas} /></Card.Body>
						</Card>
					</Col> */}
					<Col className={styles.col}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h3>Most popular times</h3>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<RadarTimeChart chartData={mostPopularTimes} cinemas={cinemas} colors={colors} />
							</Card.Body>
						</Card>
					</Col>
					<Col className={styles.col}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h3>Most popular weekdays</h3>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<RadarWeekdayChart chartData={mostPopularWeekdays} cinemas={cinemas} colors={colors} />
							</Card.Body>
						</Card>
					</Col>
					<Col className={styles.col}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h3>Most popular months</h3>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<RadarMonthChart chartData={mostPopularMonths} cinemas={cinemas} colors={colors} />
							</Card.Body>
						</Card>
					</Col>
					<Col className={styles.col}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h3>Genres popularity</h3>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<GenresDoughnutChart chartData={genresPopularity} cinemas={cinemas} />
							</Card.Body>
						</Card>
					</Col>
					<Col className={styles.col}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h3>Ratings popularity</h3>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<GenresDoughnutChart chartData={ratingsPopularity} cinemas={cinemas} />
							</Card.Body>
						</Card>
					</Col>
					{/* <Col className={styles.col}>
						<Card className={styles.card}>
							<Card.Header className={styles.cardHeader}>
								<h3>Top 10 total revenue of all movies</h3>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<Doughnut data={doughnutData(topTotalRevenueOfAllMovies[0])} options={doughnutOptions} />
							</Card.Body>
						</Card>
					</Col> */}
				</Row>
			</Container>
		</>
	);
}

export async function getServerSideProps(context) {
	await dbConnect();

	//setCookies("managing", { cinema: session.user.cinema_id });

	//const movies = await getMovies();
	const { user } = await getSession(context);
	const cinemas = await getCinemasByManager(user.id);
	//const revenueOfAllMonths = await getRevenueOfAllMonths(cinemas.map((cinema) => cinema._id));

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

	const revenueOfAllMonths = await Promise.all(
		cinemas.map(async (cinema) => {
			const revenueOfAllMonths = await getRevenueOfAllMonths(cinema._id);
			return revenueOfAllMonths;
		})
	);

	const topTotalRevenueOfAllMovies = await Promise.all(
		cinemas.map(async (cinema) => {
			const topTotalRevenueOfAllMovies = await getTopTotalRevenueOfAllMovies(cinema._id);
			return topTotalRevenueOfAllMovies;
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
			revenueOfAllMonths: JSON.parse(JSON.stringify(revenueOfAllMonths)),
			topTotalRevenueOfAllMovies: JSON.parse(JSON.stringify(topTotalRevenueOfAllMovies)),
			mostPopularTimes: JSON.parse(JSON.stringify(mostPopularTimes)),
			mostPopularWeekdays: JSON.parse(JSON.stringify(mostPopularWeekdays)),
			mostPopularMonths: JSON.parse(JSON.stringify(mostPopularMonths)),
			genresPopularity: JSON.parse(JSON.stringify(genresPopularity)),
			ratingsPopularity: JSON.parse(JSON.stringify(ratingsPopularity)),
			ticketsSoldByMovieDuration: JSON.parse(JSON.stringify(ticketsSoldByMovieDuration)),
		},
	};
}
