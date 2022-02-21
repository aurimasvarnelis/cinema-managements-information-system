import mongoose from "mongoose";
import { stringifyQuery } from "next/dist/server/server-route-utils";

const MovieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this movie'],
  },
  director: {
    type: String,
  },
  writers: {
    type: Array,
  },
  actors: {
    type: Array,
  },

})

export default mongoose.models.Movie || mongoose.model('Movie', MovieSchema)