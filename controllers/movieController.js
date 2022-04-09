import Movie from "../models/Movie"

export async function getMovies() {
  const movies = await Movie.find({})
  return movies;
}

export async function getMovie(movieId) {
  const movie = await Movie.findById(movieId)
  return movie;
}

export async function postMovie(req) {
  const movie = await Movie.create(
    req.body
  )
  return movie;
}

export async function putMovie(req) {
  const movie = await Movie.findByIdAndUpdate(req.query.movieId, req.body, {
    new: true,
    runValidators: true,
  })
  return movie;
}

export async function deleteMovie(req) {
  const deletedMovie = await Movie.deleteOne({ _id: req.query.movieId })
  return deletedMovie;
}