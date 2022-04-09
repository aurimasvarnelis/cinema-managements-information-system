import mongoose from "mongoose";
const { Schema } = mongoose;

// TODO: add embedded room
const SessionSchema = new mongoose.Schema({
  room_id: {
    type: String,
    required: true,
  },
  movie_id: {
    type: String,
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
  status: {
    type: String,
    required: false,
  }
})

export default mongoose.models.Session || mongoose.model('Session', SessionSchema)