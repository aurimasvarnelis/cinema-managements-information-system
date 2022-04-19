import {
	Button,
	Col,
	Container,
	Form,
	Modal,
	Row,
	Table,
} from "react-bootstrap";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";

// TODO: get census and genre selection from database
// TODO: set image max size to 5mb (5242880 bytes) and fix file select on canceling
export function AddMovie({ genres, ratings }) {
	// Model state
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	// Validation
	const [validated, setValidated] = useState(false);
	// Form hook
	const { register, handleSubmit, reset, setValue } = useForm();

	// Refreshing page after updating data
	const router = useRouter();
	const refreshData = () => {
		router.replace(router.asPath);
	};

	const toBase64 = async (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});

	const [poster, setPoster] = useState();
	const [cover, setCover] = useState();
	const onUploadingPoster = async (e) => {
		if (e.target.files[0]) setPoster(await toBase64(e.target.files[0]));
		//console.log(e.target.files[0]);
	};

	const postData = async (data) => {
		data.poster = await toBase64(data.poster[0]);

		const res = await fetch("/api/movies", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		// Check that our status code is in the 200s,
		// meaning the request was successful.
		if (res.status < 300) {
			refreshData();
			setPoster();
		}
		const resData = await res.json();
		//console.log(resData)
	};

	const onSubmit = (data, event) => {
		const form = event.target;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			setValidated(true);
		} else {
			postData(data);
			handleClose();
			reset();
			setValidated(false);
		}
		//alert(`Room ${data.name} has been added.`)
	};

	return (
		<>
			<Button className="my-3" variant="success" onClick={handleShow}>
				<div className="p-1 d-inline">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						className="bi bi-plus-square"
						viewBox="0 0 16 16"
					>
						<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
						<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
					</svg>
				</div>
				<div className="p-1 d-inline">Add movie</div>
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
					<Modal.Title>Add movie</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form
						noValidate
						id="hook-form"
						validated={validated}
						onSubmit={handleSubmit(onSubmit)}
					>
						<Row>
							<Col>
								<Form.Group className="mb-3" controlId="validationPoster">
									<Form.Label>Poster</Form.Label>
									<Form.Control
										required
										accept=".png, .jpg"
										type="file"
										onChangeCapture={onUploadingPoster}
										{...register("poster")}
									/>
									{poster && (
										<Image
											className="mt-3"
											src={poster}
											alt="poster"
											width="200px"
											height="300px"
											layout="fixed"
										/>
									)}
								</Form.Group>
							</Col>
							<Col>
								<Form.Group className="mb-3">
									<Form.Label htmlFor="cover">Cover</Form.Label>
									<Form.Control type="file" {...register("cover")} />
									{cover && (
										<Image
											className="mt-3"
											src={cover}
											alt="poster"
											width="200px"
											height="300px"
											layout="fixed"
										/>
									)}
								</Form.Group>
							</Col>
						</Row>

						<Row>
							<Col>
								<Form.Group className="mb-3" controlId="validationName">
									<Form.Label>Name</Form.Label>
									<Form.Control
										required
										type="text"
										placeholder="Movie name"
										{...register("name")}
									/>
									{/* <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback> */}
									{/* <Form.Control.Feedback type="invalid">Please choose a movie name.</Form.Control.Feedback> */}
								</Form.Group>
							</Col>
							<Col>
								<Form.Group className="mb-3">
									<Form.Label htmlFor="director">Director</Form.Label>
									<Form.Control
										type="text"
										placeholder="Director"
										{...register("director")}
									/>
								</Form.Group>
							</Col>
						</Row>

						<Form.Group className="mb-3">
							<Form.Label htmlFor="actors">Actors</Form.Label>
							<Form.Control
								type="text"
								placeholder="Actors"
								{...register("actors")}
							/>
						</Form.Group>
						<Row>
							<Col>
								<Form.Group className="mb-3">
									<Form.Label htmlFor="rating">Age rating</Form.Label>
									<Form.Select {...register("rating")}>
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
							</Col>
							<Col>
								<Form.Group className="mb-3">
									<Form.Label htmlFor="genre">Genre</Form.Label>
									<Form.Select required {...register("genre")}>
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
							</Col>
						</Row>

						<Row>
							<Col>
								<Form.Group className="mb-3">
									<Form.Label htmlFor="duration">Duration</Form.Label>
									<Form.Control
										type="number"
										placeholder="Duration"
										{...register("duration")}
									/>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group className="mb-3">
									<Form.Label htmlFor="premiere_date">Premiere date</Form.Label>
									<Form.Control
										required
										type="date"
										placeholder="Premiere"
										{...register("premiere_date")}
									/>
								</Form.Group>
							</Col>
						</Row>
						<Form.Group className="mb-3">
							<Form.Label htmlFor="synopsis">Synopsis</Form.Label>
							<Form.Control
								as="textarea"
								rows="3"
								placeholder="Synopsis"
								{...register("synopsis")}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" type="submit" form="hook-form">
						Submit
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
