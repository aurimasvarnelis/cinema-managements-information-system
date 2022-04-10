import mongoose from "mongoose";

const { Schema } = mongoose;

//var RoomSchema = require("./RoomSchema");

const SessionSchema = new mongoose.Schema({
  cinema_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  room_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  movie_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  display_time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: false,
  }
}, 
{ 
  timestamps: true 
})

export default mongoose.models.Session || mongoose.model('Session', SessionSchema)