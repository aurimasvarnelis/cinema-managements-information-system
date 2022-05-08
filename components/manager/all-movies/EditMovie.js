import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

// TODO: add image size validation
export function EditMovie({ movie, genres, ratings }) {
	// Model state
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	// Validation
	const [validated, setValidated] = useState(false);
	// Form hook
	const { register, handleSubmit, setValue } = useForm();

	// Refreshing page after updating data
	const router = useRouter();
	const refreshData = () => {
		router.replace(router.asPath);
	};

	const toBase64 = (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});

	// from base64 to file
	const toFile = (base64) => {
		const arr = base64.split(",");
		const mime = arr[0].match(/:(.*?);/)[1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], `${Date.now()}.png`, { type: mime });
	};

	useEffect(() => {
		setPoster(movie.poster);
	}, []);

	const [poster, setPoster] = useState();
	const [cover, setCover] = useState();
	const onUploadingPoster = async (e) => {
		setPoster(await toBase64(e.target.files[0]));
	};

	const putData = async (data) => {
		data.poster = poster;
		const res = await fetch(`/api/movies/${movie._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		if (res.status < 300) {
			refreshData();
		}
	};

	const onSubmit = (data, event) => {
		const form = event.target;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			setValidated(true);
		} else {
			putData(data);
			handleClose();
			setValidated(false);
		}
	};

	return (
		<>
			<Button variant="outline-warning" className="me-2" onClick={handleShow}>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
					<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
					<path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
				</svg>
			</Button>

			<Modal
				size="lg"
				show={show}
				onHide={() => {
					handleClose();
					setValidated(false);
				}}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Edit movie</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form noValidate id="hook-form" validated={validated} onSubmit={handleSubmit(onSubmit)}>
						<Row>
							<Col>
								<Form.Group className="mb-3" controlId="validationPoster">
									<Form.Label>Poster</Form.Label>
									<Form.Control accept=".png, .jpg" type="file" onChangeCapture={onUploadingPoster} {...register("poster")} />
									{poster && <Image className="mt-3" src={poster} alt="poster" width="200px" height="300px" layout="fixed" />}
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Group className="mb-3">
									<Form.Label>Name</Form.Label>
									<Form.Control required type="text" placeholder="Enter name" defaultValue={movie.name} {...register("name")} />
								</Form.Group>
							</Col>
							<Col>
								<Form.Group className="mb-3">
									<Form.Label htmlFor="director">Director</Form.Label>
									<Form.Control required type="text" placeholder="Director" defaultValue={movie.director} {...register("director")} />
								</Form.Group>
							</Col>
						</Row>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="actors">Actors</Form.Label>
							<Form.Control required type="text" placeholder="Actors" defaultValue={movie.actors} {...register("actors")} />
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="rating">Age rating</Form.Label>
							<Form.Select required defaultValue={movie.rating} {...register("rating")}>
								<option key="blankChoice" hidden value="">
									Select age rating
								</option>
								{ratings.map((rating, idx) => (
									<option key={idx} value={rating}>
										{rating}
									</option>
								))}
							</Form.Select>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="genre">Genre</Form.Label>
							<Form.Select required defaultValue={movie.genre} {...register("genre")}>
								<option key="blankChoice" hidden value="">
									Select genre
								</option>
								{genres.map((genre, idx) => (
									<option key={idx} value={genre}>
										{genre}
									</option>
								))}
							</Form.Select>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="duration">Duration</Form.Label>
							<Form.Control required type="number" placeholder="Duration" defaultValue={movie.duration} {...register("duration")} />
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="synopsis">Synopsis</Form.Label>
							<Form.Control as="textarea" rows="3" placeholder="Synopsis" defaultValue={movie.synopsis} {...register("synopsis")} />
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="primary" type="submit" form="hook-form">
						Update
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
