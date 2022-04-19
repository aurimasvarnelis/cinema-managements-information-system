import User from "../models/User";
import { hash } from "bcryptjs";

export async function createUser(req) {
	const { email, password } = req.body;
	const passwordHash = await hash(password, 12);

	const user = await User.create({
		email: email,
		password: passwordHash,
		role: "user",
	});

	return user;
}
