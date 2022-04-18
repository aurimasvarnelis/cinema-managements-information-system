import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	session_id: {
		type: Schema.Types.ObjectId,
		ref: "Session",
	},
	tickets: [
		{
			_id: false,
			rowIndex: Number,
			columnIndex: Number,
			ticket_type_name: String,
			price: Number,
		},
	],
	price_total: {
		type: Number,
		default: 0,
	},
	status: {
		type: String,
		enum: ["Reserved", "Pending", "Confirmed", "Cancelled"],
		default: "Reserved",
	},
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);