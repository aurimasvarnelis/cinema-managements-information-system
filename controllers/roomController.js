import Room from "../models/Room"

async function getRooms(cinemaId) {
  const rooms = await Room.find({ cinema_id: cinemaId }).exec();
  return rooms;
}

async function getRoom(req) {
  const room = await Room.findById(req.query.roomId)
  return room;
}

async function postRoom(req) {
  const room = await Room.create({
    ...req.body,
    cinema_id: req.query.cinemaId,
  })
  return room;
}

async function putRoom(req) {
  const room = await Room.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
    runValidators: true,
  })
  return room;
}

async function deleteRoom(req) {
  const deletedRoom = await Room.deleteOne({ _id: req.query.id })
  return deletedRoom;
}

module.exports = {
  getRooms,
  getRoom,
  postRoom,
  putRoom,
  deleteRoom
}