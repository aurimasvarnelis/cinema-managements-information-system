import mongoose from "mongoose";

// var MovieSchema = require("./MovieSchema");

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
    type: Number,
  },
  premiere_date: {
    type: String,
  },
  synopsis: {
    type: String,
  },
})

export default mongoose.models.Movie || mongoose.model('Movie', MovieSchema)