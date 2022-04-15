import mongoose from "mongoose";

const { Schema } = mongoose;

const SessionSchema = new mongoose.Schema(
	{
		room: {
			type: Schema.Types.Mixed,
		},
		movie_id: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		start_time: {
			type: Date,
			required: true,
		},
		end_time: {
			type: Date,
			required: true,
		},
		display_time: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: false,
		},
		ticket_types: [
			{
				ticket_type_name: {
					type: String,
					enum: ["Standard", "VIP"],
					default: "Standard",
				},
				price: {
					type: Number,
					default: 0,
				},
			},
			{ _id: false },
		],
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.Session ||
	mongoose.model("Session", SessionSchema);
