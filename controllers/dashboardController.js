import Cinema from "../models/Cinema";
import Movie from "../models/Movie";
import Order from "../models/Order";
import Room from "../models/Room";
import Session from "../models/Session";
import { isEmpty } from "lodash";

// get order revenue this month from orders
// where cinema_id is in cinemaIds
// group by index
export async function getOrderRevenueThisMonth(cinemaIds) {
	const orders = await Order.find({
		cinema_id: {
			$in: cinemaIds,
		},
		status: {
			$in: ["Confirmed"],
		},
		created_at: {
			$gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
		},
	}).exec();

	const orderRevenue = [];
	for (let i = 0; i < cinemaIds.length; i++) {
		const revenue = orders
			.filter((order) => JSON.stringify(order.cinema_id) === JSON.stringify(cinemaIds[i]))
			.reduce((acc, order) => acc + order.price_total, 0);

		orderRevenue.push(revenue);
	}

	return orderRevenue;
}

// month names const
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// get order revenue of all months from orders
// group revenue by month name and revenue of that month
// if revenue of that month is 0, then don't display that month
export async function getOrderRevenueOfAllMonths(cinemaId) {
	const orders = await Order.find({
		cinema_id: cinemaId,
		status: {
			$in: ["Confirmed"],
		},
	}).exec();

	const orderRevenueOfAllMonths = [];
	for (let i = 0; i < monthNames.length; i++) {
		const revenue = orders.filter((order) => order.created_at.getMonth() === i).reduce((acc, order) => acc + order.price_total, 0);

		if (revenue !== 0) {
			orderRevenueOfAllMonths.push({
				month: monthNames[i],
				revenue,
			});
		} else {
			orderRevenueOfAllMonths.push({
				month: monthNames[i],
				revenue: 0,
			});
		}
	}

	// for (let i = 0; i < monthNames.length; i++) {
	// 	for (let j = 0; j < orderRevenueOfAllMonths.length; j++) {
	// 		let isEmpty = 0;
	// 		// check if orderRevenueOfAllMonths[i][j] revenue is 0
	// 		// if (orderRevenueOfAllMonths[j][i].revenue === 0) {
	// 		// 	isEmpty += 1;
	// 		// }
	// 		console.log(orderRevenueOfAllMonths[j]);
	// 	}
	// 	if (isEmpty === orderRevenueOfAllMonths.length) {
	// 		// remove
	// 	}
	// 	isEmpty = 0;
	// }

	return orderRevenueOfAllMonths;
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
	}).exec();

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
			const movie = await Movie.findById(movieId).exec();
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
	}).exec();

	const mostPopularTimes = [];
	for (let i = 0; i < 24; i++) {
		const times = orders.filter((order) => order.created_at.getHours() === i).reduce((acc, order) => acc + order.price_total, 0);

		mostPopularTimes.push({
			time: i,
			revenue: times,
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
	}).exec();

	const mostPopularWeekdays = [];
	for (let i = 0; i < 7; i++) {
		const weekdays = orders.filter((order) => order.created_at.getDay() === i).reduce((acc, order) => acc + order.price_total, 0);

		mostPopularWeekdays.push({
			weekday: i,
			revenue: weekdays,
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
	}).exec();

	const mostPopularMonths = [];
	for (let i = 0; i < 12; i++) {
		const months = orders.filter((order) => order.created_at.getMonth() === i).reduce((acc, order) => acc + order.price_total, 0);

		mostPopularMonths.push({
			month: i,
			revenue: months,
		});
	}

	mostPopularMonths.sort((a, b) => b.revenue - a.revenue);

	return mostPopularMonths;
}
