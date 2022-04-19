import User from "../models/User";
import { hash } from "bcryptjs";

export async function createUser(req) {
	const { email, password, role } = req.body;
	const passwordHash = await hash(password, 12);

	if (role) {
		const user = await User.create({
			email,
			password: passwordHash,
			role,
		});
	} else {
		const user = await User.create({
			email,
			password: passwordHash,
			role: "user",
		});
	}

	return user;
}
