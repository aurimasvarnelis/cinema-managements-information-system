import {
	Button,
	Card,
	Col,
	Container,
	Form,
	Modal,
	Row,
	Table,
} from "react-bootstrap";
import { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import Image from "next/image";
import dbConnect from "../../lib/dbConnect";
import { getCookie } from "cookies-next";
import { getMovie } from "../../controllers/movieController";
import { getSession } from "../../controllers/sessionController";
import moment from "moment";
import styles from "./[sessionId].module.scss";

export default function Session({ movieSession, movie }) {
	return (
		<Container>
			<Row>aaaaaaaa</Row>
		</Container>
	);
}

export async function getServerSideProps(context) {
	await dbConnect();

	const { sessionId } = context.query;
	const session = await getSession(sessionId);
	const movie = await getMovie(session.movie_id);

	return {
		props: {
			movieSession: JSON.parse(JSON.stringify(session)),
			movie: JSON.parse(JSON.stringify(movie)),
		},
	};
}
