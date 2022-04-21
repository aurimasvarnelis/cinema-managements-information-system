import Movie from "../models/Movie";

export async function getMovies() {
	const movies = await Movie.find({});
	return movies;
}

export async function getMovie(movieId) {
	const movie = await Movie.findById(movieId);
	return movie;
}

export async function postMovie(req) {
	const movie = await Movie.create(req.body);
	return movie;
}

export async function putMovie(req) {
	const movie = await Movie.findByIdAndUpdate(req.query.movieId, req.body, {
		new: true,
		runValidators: true,
	});
	return movie;
}

export async function deleteMovie(req) {
	const deletedMovie = await Movie.deleteOne({ _id: req.query.movieId });
	return deletedMovie;
}

export async function getGenres() {
	const genres = await Movie.schema.path("genre").options.enum;
	return genres;
}

export async function getRatings() {
	const ratings = await Movie.schema.path("rating").options.enum;
	return ratings;
}

export async function getMoviesByCinemas(cinemas) {
	// loop trough cinemas
	// find movies that contain cinema._id in movie.cinemas
	// if yes, add movie to filteredMovies[index]
	const filteredMovies = [];
	for (let i = 0; i < cinemas.length; i++) {
		const movies = await Movie.find({
			cinemas: {
				$in: [cinemas[i]._id],
			},
		});
		filteredMovies.push(movies);
	}

	return filteredMovies;
}

// attach cinemaId to movie.cinemas array if movie doesn't have cinema id
export async function updateMoviesByCinemas(req) {
	const { moviesIds, cinemasIds } = req.body;
	const movies = await Movie.find({ _id: { $in: moviesIds } });

	movies.forEach((movie) => {
		const cinemasToAdd = cinemasIds.filter((cinemaId) => !movie.cinemas.includes(cinemaId));
		movie.cinemas.push(...cinemasToAdd);
		movie.save();
	});

	return movies;
}

export async function removeCinemaFromMovie(req) {
	const { movie_id: movieId, cinema_id: cinemaId } = req.query;

	const movie = await Movie.findById(movieId);
	movie.cinemas.pull(cinemaId);
	movie.save();

	return movie;
}
