import { getGenres, getRatings } from "./movieController";

import Cinema from "../models/Cinema";
import Movie from "../models/Movie";
import Order from "../models/Order";
import Room from "../models/Room";
import Session from "../models/Session";
import { isEmpty } from "lodash";

// get order revenue this month from orders
// where cinema_id is in cinemaIds
// group by index
// export async function getOrderRevenueThisMonth(cinemaIds) {
// 	const orders = await Order.find({
// 		cinema_id: {
// 			$in: cinemaIds,
// 		},
// 		status: {
// 			$in: ["Confirmed"],
// 		},
// 		created_at: {
// 			$gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
// 		},
// 	});

// 	const orderRevenue = [];
// 	for (let i = 0; i < cinemaIds.length; i++) {
// 		const revenue = orders.filter((order) => JSON.stringify(order.cinema_id) === JSON.stringify(cinemaIds[i])).reduce((acc, order) => acc + order.price_total, 0);

// 		orderRevenue.push(revenue);
// 	}

// 	return orderRevenue;
// }

// get different users this month from orders and compare to previous month
// return number of users and change percent compared to previous month
export async function getUsersThisMonth(cinemaId) {
	const orders = await Order.find({
		cinema_id: cinemaId,
		status: {
			$in: ["Confirmed"],
		},
		created_at: {
			$gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
		},
	});

	const users = orders.map((order) => order.user_id);

	const uniqueUsers = [...new Set(users)];

	const usersThisMonth = uniqueUsers.length;

	const prevMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);

	const prevMonthOrders = await Order.find({
		cinema_id: cinemaId,
		status: {
			$in: ["Confirmed"],
		},
		created_at: {
			$gte: prevMonth,
		},
	});

	const prevMonthUsers = prevMonthOrders.map((order) => order.user_id);

	const uniquePrevMonthUsers = [...new Set(prevMonthUsers)];

	const prevMonthUsersThisMonth = uniquePrevMonthUsers.length;

	const changePercent = ((usersThisMonth - prevMonthUsersThisMonth) / prevMonthUsersThisMonth) * 100;

	return {
		usersThisMonth,
		changePercent: changePercent ? changePercent : 0,
	};
}

// get orders this week and compare to previous week
// return number of orders and change percent compared to previous week
export async function getOrdersThisWeek(cinemaId) {
	const orders = await Order.find({
		cinema_id: cinemaId,
		status: {
			$in: ["Confirmed"],
		},
		created_at: {
			$gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7),
		},
	});

	const ordersThisWeek = orders.length;

	const prevWeek = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7);

	const prevWeekOrders = await Order.find({
		cinema_id: cinemaId,
		status: {
			$in: ["Confirmed"],
		},
		created_at: {
			$gte: prevWeek,
		},
	});

	const prevWeekOrdersThisWeek = prevWeekOrders.length;

	const changePercent = ((ordersThisWeek - prevWeekOrdersThisWeek) / prevWeekOrdersThisWeek) * 100;

	return {
		ordersThisWeek,
		changePercent: changePercent ? changePercent : 0,
	};
}

export async function getRevenueThisWeek(cinemaId) {
	const orders = await Order.find({
		cinema_id: cinemaId,
		status: {
			$in: ["Confirmed"],
		},
		created_at: {
			$gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7),
		},
	});

	const revenueThisWeek = orders.reduce((acc, order) => acc + order.price_total, 0);

	const prevWeek = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7);

	const prevWeekOrders = await Order.find({
		cinema_id: cinemaId,
		status: {
			$in: ["Confirmed"],
		},
		created_at: {
			$gte: prevWeek,
		},
	});

	const prevWeekRevenue = prevWeekOrders.reduce((acc, order) => acc + order.price_total, 0);

	const changePercent = ((revenueThisWeek - prevWeekRevenue) / prevWeekRevenue) * 100;

	return {
		revenueThisWeek,
		changePercent: changePercent ? changePercent : 0,
	};
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// get order revenue of all months from orders
// group revenue by month name and revenue of that month
// if revenue of that month is 0, then don't display that month
export async function getRevenueOfAllMonths(cinemaId) {
	const orders = await Order.find({
		cinema_id: cinemaId,
		status: {
			$in: ["Confirmed"],
		},
	});

	const revenueOfAllMonths = [];
	for (let i = 0; i < monthNames.length; i++) {
		const revenue = orders.filter((order) => order.created_at.getMonth() === i).reduce((acc, order) => acc + order.price_total, 0);

		if (revenue !== 0) {
			revenueOfAllMonths.push({
				month: monthNames[i],
				revenue,
			});
		} else {
			revenueOfAllMonths.push({
				month: monthNames[i],
				revenue: 0,
			});
		}
	}

	// for (let i = 0; i < monthNames.length; i++) {
	// 	// for (let j = 0; j < revenueOfAllMonths.length; j++) {
	// 	// 	let isEmpty = 0;
	// 	// 	// check if revenueOfAllMonths[j][i] revenue is 0
	// 	// 	// if (revenueOfAllMonths[j][i].revenue === 0) {
	// 	// 	// 	isEmpty += 1;
	// 	// 	// }
	// 	// 	console.log(revenueOfAllMonths[j][i]);
	// 	// }

	// 	//map trough revenueOfAllMonths[j]

	// 	if (isEmpty === revenueOfAllMonths.length) {
	// 		// remove
	// 	}
	// 	isEmpty = 0;
	// }

	return revenueOfAllMonths;
}

// get top 10 total revenue of all movies and last one is other
// group by movie_id
// sort by total revenue
// if total revenue is 0, then don't display that movie
export async function getTopTotalRevenueOfAllMovies(cinemaId) {
	const orders = await Order.find({
		cinema_id: cinemaId,
		status: {
			$in: ["Confirmed"],
		},
	});

	// get revenue only of each unique movie
	const revenueOfEachMovie = [];
	for (let i = 0; i < orders.length; i++) {
		const movieId = orders[i].movie_id;
		const movieRevenue = orders.filter((order) => order.movie_id.toString() === movieId.toString()).reduce((acc, order) => acc + order.price_total, 0);

		if (revenueOfEachMovie.find((movie) => movie.movie_id.toString() === movieId.toString())) {
			const movie = revenueOfEachMovie.find((movie) => movie.movie_id.toString() === movieId.toString());
			movie.revenue += movieRevenue;
		} else {
			// look up movie name by movieId
			const movie = await Movie.findById(movieId);
			revenueOfEachMovie.push({
				movie_id: movieId,
				name: movie.name,
				revenue: movieRevenue,
			});
		}
	}

	// sort revenue of each movie
	revenueOfEachMovie.sort((a, b) => b.revenue - a.revenue);

	// get top 10 total revenue of all unique movies and last one is other
	const topTotalRevenueOfAllMovies = [];
	for (let i = 0; i < revenueOfEachMovie.length; i++) {
		if (i < 10) {
			topTotalRevenueOfAllMovies.push(revenueOfEachMovie[i]);
		} else {
			topTotalRevenueOfAllMovies.push({
				movie_id: "other",
				name: "Other",
				revenue: revenueOfEachMovie.slice(10).reduce((acc, movie) => acc + movie.revenue, 0),
			});
			break;
		}
	}

	return topTotalRevenueOfAllMovies;
}

export async function getMostPopularTimes(cinemaId) {
	const orders = await Order.find({
		cinema_id: cinemaId,
		status: {
			$in: ["Confirmed"],
		},
	}).lean();

	const mostPopularTimes = [];
	for (let i = 0; i < 24; i++) {
		const count = orders.reduce((acc, order) => {
			if (order.created_at.getHours() === i) {
				return acc + order.tickets.length;
			} else {
				return acc;
			}
		}, 0);
		mostPopularTimes.push({
			time: i,
			count: count,
		});
	}

	mostPopularTimes.sort((a, b) => b.revenue - a.revenue);

	return mostPopularTimes;
}

export async function getMostPopularWeekdays(cinemaId) {
	const orders = await Order.find({
		cinema_id: cinemaId,
		status: {
			$in: ["Confirmed"],
		},
	}).lean();

	const mostPopularWeekdays = [];
	for (let i = 0; i < 7; i++) {
		const count = orders.reduce((acc, order) => {
			if (order.created_at.getDay() === i) {
				return acc + order.tickets.length;
			} else {
				return acc;
			}
		}, 0);

		mostPopularWeekdays.push({
			weekday: i,
			count: count,
		});
	}

	mostPopularWeekdays.sort((a, b) => b.revenue - a.revenue);

	return mostPopularWeekdays;
}

export async function getMostPopularMonths(cinemaId) {
	const orders = await Order.find({
		cinema_id: cinemaId,
		status: {
			$in: ["Confirmed"],
		},
	}).lean();

	const mostPopularMonths = [];
	for (let i = 0; i < 12; i++) {
		const count = orders.reduce((acc, order) => {
			if (order.created_at.getMonth() === i) {
				return acc + order.tickets.length;
			} else {
				return acc;
			}
		}, 0);

		mostPopularMonths.push({
			month: i,
			count: count,
		});
	}

	mostPopularMonths.sort((a, b) => b.revenue - a.revenue);

	return mostPopularMonths;
}

export async function getGenresPopularity(cinemaId) {
	const orders = await Order.find({
		cinema_id: cinemaId,
		status: {
			$in: ["Confirmed"],
		},
	})
		.lean()
		.populate("movie_id", "genre");

	const genres = await getGenres();

	const genresPopularity = [];
	for (let i = 0; i < genres.length; i++) {
		const genre = genres[i];

		const count = orders.reduce((acc, order) => {
			if (order.movie_id.genre.toString() === genre.toString()) {
				return acc + order.tickets.length;
			} else {
				return acc;
			}
		}, 0);

		genresPopularity.push({
			name: genre,
			count: count,
		});
	}

	return genresPopularity;
}

export async function getRatingsPopularity(cinemaId) {
	const orders = await Order.find({
		cinema_id: cinemaId,
		status: {
			$in: ["Confirmed"],
		},
	})
		.lean()
		.populate("movie_id", "rating");

	const ratings = await getRatings();

	const ratingsPopularity = [];
	for (let i = 0; i < ratings.length; i++) {
		const rating = ratings[i];

		const count = orders.reduce((acc, order) => {
			if (order.movie_id.rating.toString() === rating.toString()) {
				return acc + order.tickets.length;
			} else {
				return acc;
			}
		}, 0);

		ratingsPopularity.push({
			name: rating,
			count: count,
		});
	}

	return ratingsPopularity;
}

export async function getTicketsSoldByMovieDuration(cinemaId) {
	const orders = await Order.find({
		cinema_id: cinemaId,
		status: {
			$in: ["Confirmed"],
		},
	})
		.lean()
		.populate("movie_id", "duration");

	const ticketsSoldByMovieDuration = [];
	for (let i = 0; i < orders.length; i++) {
		const order = orders[i];
		const count = order.tickets.length;

		if (ticketsSoldByMovieDuration.find((movieDuration) => movieDuration.x === order.movie_id.duration)) {
			const index = ticketsSoldByMovieDuration.findIndex((movieDuration) => movieDuration.x === order.movie_id.duration);
			ticketsSoldByMovieDuration[index].y += count;
		} else {
			ticketsSoldByMovieDuration.push({
				x: order.movie_id.duration,
				y: count,
			});
		}
	}

	ticketsSoldByMovieDuration.sort((a, b) => a.x - b.x);

	return ticketsSoldByMovieDuration;
}
