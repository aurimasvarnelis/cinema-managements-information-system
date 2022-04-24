import { ArcElement, CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js";
import { Button, Card, Col, Container, Form, Modal, ProgressBar, Row, Tab, Table, Tabs } from "react-bootstrap";
import { Doughnut, Line } from "react-chartjs-2";
import { getOrderRevenueOfAllMonths, getTopTotalRevenueOfAllMovies } from "../../controllers/dashboardController";

import dbConnect from "../../lib/dbConnect";
import { getCinemasByManager } from "../../controllers/cinemaController";
import { getSession } from "next-auth/react";
import styles from "./movies.module.scss";
import { useTable } from "react-table";

//const { faker } = require("@faker-js/faker");

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
ChartJS.register(ArcElement, Tooltip, Legend);

// dashboard page
// card for revenue by month of all cinemas
// card for revenue by month of selected cinema
// top 10 total revenue of all movies
export default function dashboard({ cinemas, orderRevenueOfAllMonths, topTotalRevenueOfAllMovies }) {
	console.log(topTotalRevenueOfAllMovies);

	const dynamicOptions = (titleText) => {
		return {
			responsive: true,
			plugins: {
				legend: {
					position: "top",
				},
				title: {
					display: true,
					text: titleText,
				},
			},
		};
	};

	const dynamicData = (data) => {
		const labels = data.map((month) => month.month);
		const datasets = data.map((month) => month.revenue);
		return {
			labels,
			datasets: [
				{
					label: "Dataset 1",
					data: datasets,
					borderColor: "rgb(255, 99, 132)",
					backgroundColor: "rgba(255, 99, 132, 0.5)",
				},
			],
		};
	};

	const doughnutData = (data) => {
		const labels = data.map((movie) => movie.name);
		const datasets = data.map((movie) => movie.revenue);
		return {
			labels,
			datasets: [
				{
					label: "Top 10 total revenue of all movies",
					data: datasets,
					backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(54, 162, 235, 0.5)", "rgba(255, 206, 86, 0.5)"],
				},
			],
			borderWidth: 1,
		};
	};

	return (
		<>
			<Container>
				{/* // dashboard tab for each cinema and one tab for all cinemas */}
				<Tabs defaultActiveKey={cinemas[0]._id} id="cinema-tabs" className={styles.cinemaTabs}>
					<Tab eventKey="all" title="All Cinemas" className={styles.cinemaTab}></Tab>

					{cinemas.map((cinema, cinemaIdx) => (
						<Tab eventKey={cinema._id} title={cinema.name} key={cinema._id} className={styles.cinemaTab}>
							<Row className={styles.row}>
								{/* display card with line graph of sold tickets this month */}
								<Col className={styles.col}>
									<Card className={styles.card}>
										<Card.Header className={styles.cardHeader}>
											<h3>Order revenue by month</h3>
										</Card.Header>
										<Card.Body className={styles.cardBody}>
											{/* display orderRevenueOfAllMonths by line graph  */}
											<Line data={dynamicData(orderRevenueOfAllMonths[cinemaIdx])} options={dynamicOptions("Order revenue by month")} />
										</Card.Body>
									</Card>
								</Col>
								<Col className={styles.col}>
									<Card className={styles.card}>
										<Card.Header className={styles.cardHeader}>
											<h3>Top 10 total revenue of all movies</h3>
										</Card.Header>
										<Card.Body className={styles.cardBody}>
											<Doughnut data={doughnutData(topTotalRevenueOfAllMovies[cinemaIdx])} />
										</Card.Body>
									</Card>
								</Col>
							</Row>
						</Tab>
					))}
				</Tabs>
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

	// getTopTotalRevenueOfAllMovies
	const topTotalRevenueOfAllMovies = await Promise.all(
		cinemas.map(async (cinema) => {
			const topTotalRevenueOfAllMovies = await getTopTotalRevenueOfAllMovies(cinema._id);
			return topTotalRevenueOfAllMovies;
		})
	);

	return {
		props: {
			cinemas: JSON.parse(JSON.stringify(cinemas)),
			orderRevenueOfAllMonths: JSON.parse(JSON.stringify(orderRevenueOfAllMonths)),
			topTotalRevenueOfAllMovies: JSON.parse(JSON.stringify(topTotalRevenueOfAllMovies)),
		},
	};
}
