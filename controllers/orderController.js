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
		await order.save();
	} else {
		// create new order
		const order = new Order({
			user_id: user_id,
			session_id: session_id,
			tickets: [ticket],
		});
		await order.save();
	}

	return {
		order: order,
		session: session,
	};
}

export async function removeTicketFromOrder(req) {
	const { user_id, session_id, ticket } = req.body;
	const session = await Session.findById(session_id);

	session.room.rows[ticket.rowIndex].columns[ticket.columnIndex].status = 0;
	session.markModified("room");
	await session.save();

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
		});
		return order;
	}
}
