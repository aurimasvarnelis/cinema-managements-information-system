import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: false,
	},
	emailVerified: {
		type: String,
		default: null,
	},
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
