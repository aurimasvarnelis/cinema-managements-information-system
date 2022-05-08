import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema(
	{
		user_id: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		session_id: {
			type: Schema.Types.ObjectId,
			ref: "Session",
		},
		cinema_id: {
			type: Schema.Types.ObjectId,
			ref: "Cinema",
		},
		movie_id: {
			type: Schema.Types.ObjectId,
			ref: "Movie",
		},
		tickets: [
			{
				_id: false,
				row_index: Number,
				column_index: Number,
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
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
