import mongoose from "mongoose";

const ColumnSchema = new mongoose.Schema({
  status: {
    type: String,
  }
})

const RowSchema = new mongoose.Schema({
  columns: [
    ColumnSchema
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