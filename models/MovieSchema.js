import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
  poster: {
    //data: Buffer,
    //contentType: String,
    type: String,
  },
  // cover: {
  //   data: Buffer,
  //   contentType: String,
  // },
  name: {
    type: String,
    //required: [true, 'Please provide a name for this movie'],
  },
  director: {
    type: String,
  },
  actors: {
    type: String,
  },
  census: {
    type: String,
  },
  genre: {
    type: String,
  },
  duration: {
    type: String,
  },
  premiere_date: {
    type: Date,
  },
  synopsis: {
    type: String,
  },
})

