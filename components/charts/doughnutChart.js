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
