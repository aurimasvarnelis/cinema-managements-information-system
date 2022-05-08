import mongoose from "mongoose";

const CinemaSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide a name for this cinema"],
	},
	location: {
		type: String,
		required: [true, "Please provide a location for this cinema"],
	},
	phone: {
		type: String,
		required: [false, "Please provide a phone number for this cinema"],
	},
	email: {
		type: String,
		required: [false, "Please provide an email for this cinema"],
	},
	managers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
});

export default mongoose.models.Cinema || mongoose.model("Cinema", CinemaSchema);
