import mongoose from "mongoose";

const { Schema } = mongoose;

const SessionSchema = new mongoose.Schema(
	{
		// room is embedded sub-document mimicking the structure of the room model
		room: {
			type: Schema.Types.Mixed,
			ref: "Room",
		},
		cinema_id: {
			type: Schema.Types.ObjectId,
			ref: "Cinema",
		},
		movie_id: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Movie",
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
		ticket_types: [
			{
				ticket_type_name: {
					type: String,
					enum: ["Standard"],
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
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);
