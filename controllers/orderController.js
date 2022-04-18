import Order from "../models/Order";
import Session from "../models/Session";

// export async function getOrders() {
//   const orders = await Order.find({});
//   return orders;
// }

export async function getOrder(orderId) {
	const order = await Order.findById(orderId);
	return order;
}

export async function addTicketToOrder(req) {
	const { user_id, session_id, ticket } = req.body;
	const session = await Session.findById(session_id);

	if (
		session.room.rows[ticket.rowIndex].columns[ticket.columnIndex].status === 0
	) {
		session.room.rows[ticket.rowIndex].columns[ticket.columnIndex].status = 1;
		session.markModified("room");
		await session.save();
	} else {
		return {
			error: "This seat is already taken.",
			session: session,
		};
	}

	const order = await Order.findOne({
		user_id: user_id,
		session_id: session_id,
	});

	if (order) {
		// update order
		order.tickets = [...order.tickets, ticket];
		order.price_total = order.price_total + ticket.price;
		await order.save();

		return {
			order: order,
			session: session,
		};
	} else {
		// create new order
		const newOrder = new Order({
			user_id: user_id,
			session_id: session_id,
			tickets: [ticket],
			price_total: ticket.price,
		});
		console.log(newOrder);
		await newOrder.save();

		return {
			order: newOrder,
			session: session,
		};
	}
}

export async function removeTicketFromOrder(req) {
	const { user_id, session_id, ticket } = req.body;
	const session = await Session.findById(session_id);

	if (
		session.room.rows[ticket.rowIndex].columns[ticket.columnIndex].status === 1
	) {
		session.room.rows[ticket.rowIndex].columns[ticket.columnIndex].status = 0;
		session.markModified("room");
		await session.save();
	} else {
		return {
			error: "This seat is already free.",
			session: session,
		};
	}

	const order = await Order.findOne({
		user_id: user_id,
		session_id: session_id,
	});

	if (order) {
		// update order
		order.tickets = order.tickets.filter((t) => {
			return (
				t.rowIndex !== ticket.rowIndex || t.columnIndex !== ticket.columnIndex
			);
		});
		order.price_total = order.price_total - ticket.price;
		await order.save();
	}

	return {
		order: order,
		session: session,
	};
}

export async function getCurrentUserOrder(userId, sessionId) {
	const order = await Order.findOne({
		user_id: userId,
		session_id: sessionId,
	});

	if (order) {
		return order;
	} else {
		const order = new Order({
			user_id: userId,
			session_id: sessionId,
			tickets: [],
			price_total: 0,
		});
		return order;
	}
}