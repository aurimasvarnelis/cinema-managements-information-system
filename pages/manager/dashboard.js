import { Button, Card, Col, Container, Form, Modal, ProgressBar, Row, Tab, Table, Tabs } from "react-bootstrap";
import { GenresDoughnutChart, RatingsDoughnutChart } from "../../components/charts/doughnutChart";
import { RadarMonthChart, RadarTimeChart, RadarWeekdayChart } from "../../components/charts/radarChart";
import {
	getGenresPopularity,
	getMostPopularMonths,
	getMostPopularTimes,
	getMostPopularWeekdays,
	getOrderRevenueOfAllMonths,
	getRatingsPopularity,
	getTopTotalRevenueOfAllMovies,
} from "../../controllers/dashboardController";

import { LineChart } from "../../components/charts/lineChart";
import dbConnect from "../../lib/dbConnect";
import { getCinemasByManager } from "../../controllers/cinemaController";
import { getSession } from "next-auth/react";
import styles from "./movies.module.scss";
import { useEffect } from "react";

// import { getGenres, getMovies, getRatings } from "../controllers/movieController";

//const { faker } = require("@faker-js/faker");

// dashboard page
// card for revenue by month of all cinemas
// card for revenue by month of selected cinema
// top 10 total revenue of all movies
// most popular genres
export default function dashboard({ cinemas, orderRevenueOfAllMonths, topTotalRevenueOfAllMovies, mostPopularTimes, mostPopularWeekdays, mostPopularMonths, genresPopularity, ratingsPopularity }) {
	console.log(genresPopularity);

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
								<h3>Order revenue by month</h3>
							</Card.Header>
							<Card.Body className={styles.cardBody}>
								<LineChart chartData={orderRevenueOfAllMonths} cinemas={cinemas} colors={colors} />
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
	//const orderRevenueOfAllMonths = await getOrderRevenueOfAllMonths(cinemas.map((cinema) => cinema._id));

	// get order revenue array of all months for each cinema in a array
	const orderRevenueOfAllMonths = await Promise.all(
		cinemas.map(async (cinema) => {
			const orderRevenueOfAllMonths = await getOrderRevenueOfAllMonths(cinema._id);
			return orderRevenueOfAllMonths;
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

	// getGenresPopularity
	const genresPopularity = await Promise.all(
		cinemas.map(async (cinema) => {
			const genresPopularity = await getGenresPopularity(cinema._id);
			return genresPopularity;
		})
	);

	// getRatingsPopularity
	const ratingsPopularity = await Promise.all(
		cinemas.map(async (cinema) => {
			const ratingsPopularity = await getRatingsPopularity(cinema._id);
			return ratingsPopularity;
		})
	);

	return {
		props: {
			cinemas: JSON.parse(JSON.stringify(cinemas)),
			orderRevenueOfAllMonths: JSON.parse(JSON.stringify(orderRevenueOfAllMonths)),
			topTotalRevenueOfAllMovies: JSON.parse(JSON.stringify(topTotalRevenueOfAllMovies)),
			mostPopularTimes: JSON.parse(JSON.stringify(mostPopularTimes)),
			mostPopularWeekdays: JSON.parse(JSON.stringify(mostPopularWeekdays)),
			mostPopularMonths: JSON.parse(JSON.stringify(mostPopularMonths)),
			genresPopularity: JSON.parse(JSON.stringify(genresPopularity)),
			ratingsPopularity: JSON.parse(JSON.stringify(ratingsPopularity)),
		},
	};
}
