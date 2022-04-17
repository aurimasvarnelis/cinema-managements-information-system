import mongoose from "mongoose";

const { Schema } = mongoose;

// movie tickets reservation schema
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
