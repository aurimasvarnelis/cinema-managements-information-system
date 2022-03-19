import mongoose from "mongoose";
import { stringifyQuery } from "next/dist/server/server-route-utils";

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
  // director: {
  //   type: String,
  // },
  // writer: {
  //   type: String,
  // },
  // actor: {
  //   type: String,
  // },
  // census: {
  //   type: String,
  // },
  // genre: {
  //   type: String,
  // },
  // duration: {
  //   type: String,
  // },
  // premiere: {
  //   type: String,
  // },
  // description: {
  //   type: String,
  // },




})

export default mongoose.models.Movie || mongoose.model('Movie', MovieSchema)