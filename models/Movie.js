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

  rating: {
    type: String,
    enum: ["G", "PG", "PG-13", "R", "NC-17"],
  },
  genre: {
    type: String,
    enum: [
      "Action",
      "Adventure",
      "Animation",
      "Comedy",
      "Crime",
      "Documentary",
      "Drama",
      "Family",
      "Fantasy",
      "History",
      "Horror",
      "Music",
      "Mystery",
      "Romance",
      "Sci-Fi",
      "Sport",
      "Thriller",
      "War",
      "Western",
    ],
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
  trailer: {
    type: String,
  },
});

export default mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
