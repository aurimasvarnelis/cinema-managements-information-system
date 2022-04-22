import { Button, Card, Col, Container, Form, Modal, ProgressBar, Row, Tab, Table, Tabs } from "react-bootstrap";
import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js";

import { Line } from "react-chartjs-2";
import cinemas from "./../admin/cinemas";
import dbConnect from "../../lib/dbConnect";
import { getCinemasByManager } from "../../controllers/cinemaController";
import { getOrderRevenueThisMonth } from "../../controllers/dashboardController";
import { getSession } from "next-auth/react";
import styles from "./movies.module.scss";
import { useTable } from "react-table";

const { faker } = require("@faker-js/faker");

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top",
		},
		title: {
			display: true,
			text: "Chart.js Line Chart",
		},
	},
};

export const data = {
	labels,
	datasets: [
		{
			label: "Dataset 1",
			data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
			borderColor: "rgb(255, 99, 132)",
			backgroundColor: "rgba(255, 99, 132, 0.5)",
		},
	],
};

// dashboard page
export default function dashboard({ cinemas, cinemasRevenuesThisMonth }) {
	console.log(cinemasRevenuesThisMonth);
	return (
		<>
			<Container>
				{/* // dashboard tab for each cinema and one tab for all cinemas */}
				<Tabs defaultActiveKey="profile" id="cinema-tabs" className={styles.cinemaTabs}>
					<Tab eventKey="all" title="All Cinemas" className={styles.cinemaTab}></Tab>

					{cinemas.map((cinema, cinemaIdx) => (
						<Tab eventKey={cinema._id} title={cinema.name} key={cinema._id} className={styles.cinemaTab}>
							<Row className={styles.row}>
								<Col className={styles.col}>
									<Card className={styles.card}>
										<Card.Header className={styles.cardHeader}>
											<h3>{cinema.name}</h3>
										</Card.Header>
										<Card.Body className={styles.cardBody}>
											<Line data={data} options={options} />
										</Card.Body>
									</Card>
								</Col>
								{/* display card with line graph of sold tickets this month */}
								<Col className={styles.col}>
									<Card className={styles.card}>
										<Card.Header className={styles.cardHeader}>
											<h3>{cinema.name}</h3>
										</Card.Header>
										<Card.Body className={styles.cardBody}>{cinemasRevenuesThisMonth[cinemaIdx]}</Card.Body>
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

	//const movies = await getMovies();
	const { user } = await getSession(context);
	const cinemas = await getCinemasByManager(user.id);
	const cinemasRevenuesThisMonth = await getOrderRevenueThisMonth(cinemas.map((cinema) => cinema._id));

	return {
		props: {
			cinemas: JSON.parse(JSON.stringify(cinemas)),
			cinemasRevenuesThisMonth: JSON.parse(JSON.stringify(cinemasRevenuesThisMonth)),
		},
	};
}
