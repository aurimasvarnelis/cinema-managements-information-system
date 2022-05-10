import { Container } from "react-bootstrap";

export default function Home() {
	return (
		<Container>
			<h1
				className="text-center"
				style={{
					fontSize: "3rem",
					fontWeight: "bold",
					marginTop: "10rem",
					marginBottom: "10rem",
				}}
			>
				Welcome to the Cinema
			</h1>
		</Container>
	);
}
