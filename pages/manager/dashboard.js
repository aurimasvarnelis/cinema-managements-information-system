import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";

// import dbConnect from "../../lib/dbConnect";

export default function dashboard() {
	return (
		<>
			<Container></Container>
		</>
	);
}

// export async function getServerSideProps() {
// 	await dbConnect();

// 	const movies = await getMovies();
// 	const genres = await getGenres();
// 	const ratings = await getRatings();

// 	return {
// 		props: {
// 			movies: JSON.parse(JSON.stringify(movies)),
// 			genres: JSON.parse(JSON.stringify(genres)),
// 			ratings: JSON.parse(JSON.stringify(ratings)),
// 		},
// 	};
// }
