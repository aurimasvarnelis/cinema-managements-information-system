import { Button, Card, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { forwardRef, useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import Image from "next/image";
import Link from "next/link";
import dbConnect from "../../lib/dbConnect";
import { getCookie } from "cookies-next";
import { getMovie } from "../../controllers/movieController";
import { getSessionsByMovie } from "../../controllers/sessionController";
import moment from "moment";
import styles from "./[movieId].module.scss";

export default function Movie({ movie, sessions }) {
	const [showMore, setShowMore] = useState(false);

	const synopsis = movie.synopsis;
	const handleShowMore = () => {
		setShowMore(!showMore);
	};

	// sort sessions by unique moment(session.start_time).format("YYYY-MM-DD")
	const sortedSessions = sessions.sort((a, b) => (moment(a.start_time).format("YYYY-MM-DD") > moment(b.start_time).format("YYYY-MM-DD") ? 1 : -1));

	// group by date and include only sessions that are not in the past
	const groupedSessions = sortedSessions.reduce((acc, session) => {
		const date = moment(session.start_time).format("YYYY-MM-DD");
		if (moment(session.start_time).isAfter(moment())) {
			if (!acc[date]) {
				acc[date] = [];
			}
			acc[date].push(session);
		}
		return acc;
	}, {});

	const [startDate, setStartDate] = useState(moment(Object.keys(groupedSessions)[0]).toDate());

	const DateCustomInput = forwardRef(({ value, onClick }, ref) => {
		return (
			<>
				<Button className="example-custom-input " onClick={onClick} ref={ref}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="feather feather-calendar"
					>
						<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
						<line x1="16" y1="2" x2="16" y2="6"></line>
						<line x1="8" y1="2" x2="8" y2="6"></line>
						<line x1="3" y1="10" x2="21" y2="10"></line>
					</svg>
					<span className={`${styles.dateValue} mx-3`}>{value}</span>
				</Button>
			</>
		);
	});
	DateCustomInput.displayName = "DateCustomInput";

	return (
		<Container>
			<Row>
				<Col xs={0} md={5} lg={5} xl={5}>
					<div>
						<Image className="movie-poster rounded-3" src={movie.poster} alt="First slide" width="686px" height="1016px" layout="responsive" />
					</div>
					<div className={styles.movieTags}></div>
					<div className={styles.movieInfo}>
						<dl>
							<dt>Genre</dt>
							<dd>{movie.genre}</dd>
							<dt>Rating</dt>
							<dd>{movie.rating}</dd>
							<dt>Duration</dt>
							<dd>{movie.duration} min.</dd>
						</dl>
					</div>
					<div className={styles.movieSynopsis}>
						<span className={`${styles.movieSynopsisText} `}>{!showMore ? synopsis.substring(0, 100) + "..." : synopsis}</span>
						<Button className={styles.movieSynopsisButton} variant="link" onClick={handleShowMore}>
							{showMore ? "Show less" : "Show more"}
						</Button>
					</div>
				</Col>
				<Col xs={12} md={7} lg={7} xl={7}>
					<div className={styles.movieSection}>
						<h1 className={styles.movieTitle}>{movie.name}</h1>

						<div className={styles.movieDate}>
							<div className={styles.date}>
								<DatePicker
									selected={startDate}
									onChange={(date) => setStartDate(date)}
									dateFormat="MMMM d"
									disabledKeyboardNavigation
									customInput={<DateCustomInput />}
									dateFormatCalendar="MMMM"
									filterDate={(date) => {
										return Object.keys(groupedSessions).includes(moment(date).format("YYYY-MM-DD"));
									}}
								/>
								<Button
									className={styles.dateButton}
									variant="link"
									onClick={() => {
										setStartDate(moment(Object.keys(groupedSessions)[0]).toDate());
									}}
								></Button>
							</div>
							<div className={styles.sessions}>
								<ul>
									{groupedSessions[moment(startDate).format("YYYY-MM-DD")]?.map((session) => (
										<li key={session._id} className={styles.session}>
											<span className={styles.sessionTime}>{moment(session.start_time).format("HH:mm")}</span>
											<span className="mx-3">{session.room.name}</span>
											<Link href="/sessions/[sessionId]" as={`/sessions/${session._id}`} passHref>
												<Button className={styles.sessionBuy}>Buy tickets</Button>
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>

						{/* <div className={styles.playerWrapper}>
              <ReactPlayer
                className={styles.reactPlayer}
                url="https://www.youtube.com/watch?v=5DlROhT8NgU"
                width="100%"
                height="100%"
                controls={false}
              />
            </div> */}
					</div>
				</Col>
			</Row>
		</Container>
	);
}

export async function getServerSideProps(context) {
	await dbConnect();

	const { movieId } = context.query;
	const cinemaId = getCookie("cinemaId", context);
	const movie = await getMovie(movieId);
	const sessions = await getSessionsByMovie(cinemaId, movieId);
	return {
		props: {
			movie: JSON.parse(JSON.stringify(movie)),
			sessions: JSON.parse(JSON.stringify(sessions)),
		},
	};
}
