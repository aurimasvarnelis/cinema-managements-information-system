import mongoose from "mongoose";
const { Schema } = mongoose;

const ColumnSchema = new mongoose.Schema({
  status: {
    type: String,
  }
},
{ _id: false })

const RowSchema = new mongoose.Schema({
  columns: [
    ColumnSchema
  ]
},
{ _id: false })

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
    required: false,
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
//const RoomSchema = require("./RoomSchema");

export default mongoose.models.Room || mongoose.model('Room', RoomSchema)