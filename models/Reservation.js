import mongoose from "mongoose";

const { Schema } = mongoose;

const TicketSchema = new Schema({
	session_id: {
		type: Schema.Types.ObjectId,
		ref: "Session",
		required: true,
	},
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	ticket_type_id: {
		type: Schema.Types.ObjectId,
		ref: "TicketType",
		required: true,
	},
	row: {
		type: Number,
		required: true,
	},
	column: {
		type: Number,
		required: true,
	},
	status: {
		type: Number,
		required: true,
	},
});

const ReservationSchema = new mongoose.Schema(
	{
		session_id: {
			required: true,
			type: Schema.Types.ObjectId,
		},
		user_id: {
			required: true,
			type: Schema.Types.ObjectId,
		},
		seat_id: {
			required: true,
			type: Schema.Types.ObjectId,
		},
		status: {
			type: String,
			enum: ["Pending", "Confirmed", "Cancelled"],
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);
