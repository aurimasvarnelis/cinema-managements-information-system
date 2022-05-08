import { ArcElement, CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, Plugin, PointElement, Title, Tooltip } from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartDataLabels);

export function MonthlyRevenueLineChart({ chartData, cinemas, colors }) {
	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom",
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						let label = context.dataset.label || "";
						if (label) {
							label += ": ";
						}
						if (context.parsed !== null) {
							label += new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(context.raw);
						}
						return label;
					},
				},
			},
			datalabels: {
				display: function (context) {
					return context.dataset.data[context.dataIndex] !== 0;
				},
			},
		},
		scales: {
			y: {
				ticks: {
					callback: function (value, index, ticks) {
						return "$" + value;
					},
				},
			},
		},
	};

	const data = {
		labels: monthNames,
		datasets: chartData?.map((cinema, idx) => {
			return {
				label: cinemas[idx].name,
				data: cinema.map((month) => month.revenue),
				backgroundColor: `rgba(${colors[idx]} , 0.5)`,
				borderColor: `rgba(${colors[idx]} , 1)`,
			};
		}),
	};

	return <Line data={data} options={options} />;
}

export function TicketsSoldByMovieDurationLineChart({ chartData, cinemas, colors }) {
	const minX = Math.min(...chartData.map((cinema) => Math.min(...cinema.map((ticket) => ticket.x))));
	const maxX = Math.max(...chartData.map((cinema) => Math.max(...cinema.map((ticket) => ticket.x))));

	const linearChartData = chartData.map((cinema, idx) => {
		const cinemaData = [];
		for (let i = minX; i <= maxX; i++) {
			const ticket = cinema.find((ticket) => ticket.x === i);

			if (ticket) {
				cinemaData.push({ x: i, y: ticket.y });
			} else {
				cinemaData.push({ x: i, y: 0 });
			}
		}
		return cinemaData;
	});

	//console.log(linearChartData);

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom",
			},
			datalabels: {
				display: function (context) {
					return context.dataset.data[context.dataIndex] !== 0;
				},
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						let label = context.dataset.label || "";
						if (label) {
							label += ": ";
						}
						if (context.parsed !== null) {
							label += context.raw + " tickets";
						}
						return label;
					},
				},
			},
		},
		scales: {
			y: {
				ticks: {
					callback: function (value, index, ticks) {
						return value + " tickets";
					},
				},
			},
		},
	};

	const data = {
		labels: linearChartData[0].map((x) => x.x.toString() + " min"),
		datasets: linearChartData?.map((cinema, idx) => {
			return {
				label: cinemas[idx].name,
				data: cinema.map((ticket) => {
					if (ticket.y === 0) {
						return Number.NaN;
					} else {
						return ticket.y;
					}
				}),
				spanGaps: true,
				cubicInterpolationMode: "monotone",
				tension: 0.4,
				backgroundColor: `rgba(${colors[idx]} , 0.5)`,
				borderColor: `rgba(${colors[idx]} , 1)`,
			};
		}),
	};

	return <Line data={data} options={options} />;
}
