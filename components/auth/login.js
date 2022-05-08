import { Button, Form, Modal } from "react-bootstrap";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useState } from "react";

//import { Register } from "./register";

export default function Login() {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [loginActive, setLoginActive] = useState(true);

	const { register, handleSubmit } = useForm();

	const onSubmit = async (data) => {
		if (loginActive) {
			const status = await signIn("credentials", {
				redirect: false,
				email: data.loginEmail,
				password: data.loginPassword,
			});
			console.log(status);
		} else {
			if (data.registerPassword !== data.registerPasswordConfirm) {
				return setError("Passwords do not match");
			}
			const status = await signIn("credentials", {
				redirect: false,
				email: data.registerEmail,
				password: data.registerPassword,
			});
			console.log(status);
		}
	};

	const onGoogleSignIn = (e) => {
		signIn("google");
	};

	return (
		<>
			<Button onClick={handleShow}>Sign In</Button>

			<Modal
				dialogClassName="modal-login"
				show={show}
				onHide={() => {
					handleClose();
					setLoginActive(true);
				}}
				centered
			>
				{/* <Modal.Header closeButton></Modal.Header> */}

				{loginActive ? (
					<>
						<Modal.Header closeButton>
							<Modal.Title>Login</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<div className="text-center social-btn">
								{/* <a
							href="#"
							className="btn btn-primary btn-block w-100"
							onClick={() => signIn("facebook")}
						>
							{" "}
							Sign in with <b>Facebook</b>
						</a> */}
								<a href="#" className="btn btn-danger btn-block w-100" onClick={() => signIn("google")}>
									{" "}
									Sign in with <b>Google</b>
								</a>
							</div>
							<div className="or my-2">or</div>
							<Form id="login-hook-form" onSubmit={handleSubmit(onSubmit)}>
								<Form.Group className="mb-3">
									<Form.Control required type="email" placeholder="Email" {...register("loginEmail")} />
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Control type="password" placeholder="Password" {...register("loginPassword")} />
								</Form.Group>
							</Form>
							{/* <div className="forgot-password w-100 d-flex small">
						<Button variant="link">Forgot password?</Button>
					</div> */}
							<Button variant="primary w-100" type="submit" form="login-hook-form">
								Log in
							</Button>
							<div className="sign-up-link">
								<span>Don&apos;t have an account?</span>
								<Button
									variant="link"
									onClick={() => {
										setLoginActive(false);
										// handleShow();
									}}
								>
									Sign up
								</Button>
							</div>
						</Modal.Body>
					</>
				) : (
					<>
						<Modal.Header closeButton>
							<Modal.Title>Register</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form id="register-hook-form" onSubmit={handleSubmit(onSubmit)}>
								<Form.Group className="mb-3">
									<Form.Control required type="email" placeholder="Email" {...register("registerEmail")} />
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Control type="password" placeholder="Password" {...register("registerPassword")} />
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Control type="password" placeholder="Repeat Password" {...register("registerPasswordConfirm")} />
								</Form.Group>
							</Form>
							<Button
								variant="primary w-100"
								type="submit"
								form="register-hook-form"
								onClick={() => {
									setLoginActive(false);
									// handleShow();
								}}
							>
								Sign up
							</Button>
						</Modal.Body>
					</>
				)}
			</Modal>
		</>
	);
}
