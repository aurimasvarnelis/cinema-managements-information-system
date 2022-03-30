import mongoose from "mongoose";
const { Schema } = mongoose;

const CellSchema = new mongoose.Schema({
  status: {
    type: String,
  }
})

const RowSchema = new mongoose.Schema({
  cells: [
    CellSchema
  ]
})

const RoomSchema = new mongoose.Schema({
  cinema_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rows: [
    RowSchema
  ]
  // capacity: {
  //   type: Number,
  // },
  // roomType: {
  //   type: String,
  // },
})

RoomSchema.set("versionKey", false);

export default mongoose.models.Room || mongoose.model('Room', RoomSchema)