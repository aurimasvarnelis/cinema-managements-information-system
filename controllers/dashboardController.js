import Cinema from "../models/Cinema";
import Order from "../models/Order";
import Room from "../models/Room";
import Session from "../models/Session";

// get order revenue this month from orders
// where cinema_id is in cinemaIds
// group by index
export async function getOrderRevenueThisMonth(cinemaIds) {
	const orders = await Order.find({
		cinema_id: {
			$in: cinemaIds,
		},
		status: {
			$in: ["Confirmed"],
		},
		created_at: {
			$gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
		},
	}).exec();

	const orderRevenue = [];
	for (let i = 0; i < cinemaIds.length; i++) {
		const revenue = orders
			.filter((order) => JSON.stringify(order.cinema_id) === JSON.stringify(cinemaIds[i]))
			.reduce((acc, order) => acc + order.price_total, 0);

		orderRevenue.push(revenue);
	}

	return orderRevenue;
}
