import { ArcElement, CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, Plugin, PointElement, Title, Tooltip } from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "bottom",
		},
		datalabels: {
			color: "black",
			formatter: function (value, context) {
				var hiddens = context.chart._hiddenIndices;
				var total = 0;
				var datapoints = context.dataset.data;
				datapoints.forEach((val, i) => {
					if (hiddens[i] != undefined) {
						if (!hiddens[i]) {
							total += val;
						}
					} else {
						total += val;
					}
				});
				var percentage = ((value / total) * 100).toFixed(0) + "%";
				var out = context.chart.data.labels[context.dataIndex] + "\n" + percentage;
				return out;
			},
			display: function (context) {
				return context.dataset.data[context.dataIndex] !== 0;
			},
		},
		tooltip: {
			callbacks: {
				label: function (context) {
					var hiddens = context.chart._hiddenIndices;
					var total = 0;
					var datapoints = context.dataset.data;
					datapoints.forEach((val, i) => {
						if (hiddens[i] != undefined) {
							if (!hiddens[i]) {
								total += val;
							}
						} else {
							total += val;
						}
					});
					var percentage = ((context.parsed / total) * 100).toFixed(0) + "%";
					var out = "(" + context.dataset.label + ") " + context.chart.data.labels[context.dataIndex] + "\n" + percentage;
					return out;
				},
			},
		},
	},
};

export function GenresDoughnutChart({ chartData, cinemas }) {
	const dynamicColors = () => {
		var r = Math.floor(Math.random() * 255);
		var g = Math.floor(Math.random() * 255);
		var b = Math.floor(Math.random() * 255);
		return r + "," + g + "," + b;
	};

	const colors = chartData[0].map((genre, idx) => {
		return dynamicColors();
	});

	const data = {
		labels: chartData[0].map((genre) => genre.name),
		datasets: chartData?.map((cinema, idx) => {
			return {
				label: cinemas[idx].name,
				data: cinema.map((genre) => genre.count),
				backgroundColor: colors.map((color) => `rgba(${color} , 0.5)`),
				backgroundColor: colors.map((color) => `rgba(${color} , 0.5)`),
			};
		}),
	};

	return <Doughnut data={data} options={options} />;
}

export function RatingsDoughnutChart({ chartData, cinemas }) {
	const dynamicColors = () => {
		var r = Math.floor(Math.random() * 255);
		var g = Math.floor(Math.random() * 255);
		var b = Math.floor(Math.random() * 255);
		return r + "," + g + "," + b;
	};

	const colors = chartData[0].map((genre, idx) => {
		return dynamicColors();
	});

	const data = {
		labels: chartData[0].map((genre) => genre.name),
		datasets: chartData?.map((cinema, idx) => {
			return {
				label: cinemas[idx].name,
				data: cinema.map((genre) => genre.count),
				backgroundColor: colors.map((color) => `rgba(${color} , 0.5)`),
				backgroundColor: colors.map((color) => `rgba(${color} , 0.5)`),
			};
		}),
	};

	return <Doughnut data={data} options={options} />;
}

// export function DoughnutChart({ cinemasRevenueDataFromMovies, cinemas }) {
// 	// options for doughnut chart
// 	// console.log(cinemasRevenueDataFromMovies);
// 	// console.log(cinemas);

// 	// data for doughnut chart
// 	// map cinemasRevenueDataFromMovies as multiple datasets
// 	const data = {
// 		//labels: cinemasRevenueDataFromMovies.map((movie) => movie.name),
// 		datasets: cinemasRevenueDataFromMovies?.map((cinema, idx) => {
// 			return {
// 				label: "aaaa",
// 				//labels: cinema.map((movie) => movie.name),
// 				data: cinema.map((month) => month.revenue),
// 				backgroundColor: [
// 					"rgba(255, 99, 132, 0.5)",
// 					"rgba(54, 162, 235, 0.5)",
// 					"rgba(255, 206, 86, 0.5)",
// 					"rgba(75, 192, 192, 0.5)",
// 					"rgba(153, 102, 255, 0.5)",
// 					"rgba(255, 159, 64, 0.5)",
// 					"rgba(255, 99, 132, 0.5)",
// 					"rgba(54, 162, 235, 0.5)",
// 					"rgba(255, 206, 86, 0.5)",
// 					"rgba(75, 192, 192, 0.5)",
// 				],
// 			};
// 		}),
// 		labels: cinemasRevenueDataFromMovies?.map((cinema, idx) => {
// 			return cinema.map((movie) => movie.name);
// 		}),
// 	};

// 	const options = {
// 		// plugins: {
// 		// 	tooltip: {
// 		// 		callbacks: {
// 		// 			label: function (tooltipItem, data) {
// 		// 				var dataset = data.datasets[tooltipItem.datasetIndex];
// 		// 				var index = tooltipItem.index;
// 		// 				return dataset.labels[index] + ": " + dataset.data[index];
// 		// 			},
// 		// 		},
// 		// 	},
// 		// },
// 		// tooltips: {
// 		//   callbacks: {
// 		//     label: function(tooltipItem, data) {
// 		//       var dataset = data.datasets[tooltipItem.datasetIndex];
// 		//       var index = tooltipItem.index;
// 		//       return dataset.labels[index] + ": " + dataset.data[index];
// 		//     }
// 		//   }
// 		// }
// 		responsive: true,
// 		plugins: {
// 			legend: {
// 				position: "bottom",
// 			},
// 			// tooltips: {
// 			// 	callbacks: {
// 			// 		label: function (tooltipItem, data) {
// 			// 			var dataset = data.datasets[tooltipItem.datasetIndex];
// 			// 			var index = tooltipItem.index;
// 			// 			return dataset.labels[index] + ": " + dataset.data[index];
// 			// 		},
// 			// 	},
// 			// },

// 			// labels: {
// 			// 	render: "label",
// 			// 	fontStyle: "normal",
// 			// 	fontSize: 12,
// 			// 	fontColor: "#fff",
// 			// 	fontFamily: "Arial",
// 			// 	arc: true,
// 			// },
// 			// datalabels: {
// 			// 	formatter: function (value, context) {
// 			// 		return context.chart.data.labels[context.dataIndex];
// 			// 	},
// 			// 	color: "white",
// 			// 	font: {
// 			// 		weight: "bold",
// 			// 		size: 18,
// 			// 	},
// 			// 	padding: 4,
// 			// },
// 		},
// 	};

// 	return <Doughnut data={data} options={options} />;
// 	//return <p>ddd</p>;
// }
