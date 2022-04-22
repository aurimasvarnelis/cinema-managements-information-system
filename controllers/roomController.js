import Room from "../models/Room";

export async function getRooms(cinemaId) {
	const rooms = await Room.find({ cinema_id: cinemaId }).exec();
	return rooms;
}

export async function getRoom(req) {
	const room = await Room.findById(req.query.roomId);
	return room;
}

export async function postRoom(req) {
	const room = await Room.create({
		...req.body,
		cinema_id: req.query.cinemaId,
	});
	return room;
}

export async function putRoom(req) {
	const room = await Room.findByIdAndUpdate(req.query.roomId, req.body, {
		new: true,
		runValidators: true,
	});
	return room;
}

export async function deleteRoom(req) {
	const deletedRoom = await Room.deleteOne({ _id: req.query.roomId });
	return deletedRoom;
}

export async function getRoomsByCinemas(cinemas) {
	const filteredRooms = [];
	for (let i = 0; i < cinemas.length; i++) {
		const rooms = await Room.find({
			cinema_id: {
				$in: [cinemas[i]._id],
			},
		});
		filteredRooms.push(rooms);
	}

	return filteredRooms;
}
