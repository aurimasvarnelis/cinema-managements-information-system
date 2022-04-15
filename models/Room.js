import mongoose from "mongoose";

const { Schema } = mongoose;

const ColumnSchema = new mongoose.Schema(
	{
		status: {
			type: Number,
			enum: [
				-1, // Empty
				0, // Available
				1, // Reserved
				2, // Occupied
			],
			default: 1,
		},
		ticket_id: {
			type: Schema.Types.ObjectId,
			default: null,
		},
	},
	{ _id: false }
);

const RowSchema = new mongoose.Schema(
	{
		columns: [ColumnSchema],
	},
	{ _id: false }
);

const RoomSchema = new mongoose.Schema({
	cinema_id: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	capacity: {
		type: Number,
		required: true,
	},
	door_placement: {
		type: String,
		enum: ["left", "right", "both"],
		required: false,
	},
	staircase_placement: {
		type: String,
		enum: ["left", "right", "both"],
		required: false,
	},
	rows: [RowSchema],
});
//const RoomSchema = require("./RoomSchema");

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);
