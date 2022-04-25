import { Chart as ChartJS, Filler, Legend, LineElement, PointElement, RadialLinearScale, Tooltip } from "chart.js";

import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function RadarTimeChart({ chartData, cinemas, colors }) {
	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "bottom",
			},
		},
	};

	const data = {
		labels: [...Array(24).keys()],
		datasets: chartData?.map((cinema, idx) => {
			return {
				label: cinemas[idx].name,
				data: cinema.map((month) => month.revenue),
				backgroundColor: `rgba(${colors[idx]} , 0.5)`,
				borderColor: `rgba(${colors[idx]} , 1)`,
			};
		}),
	};

	return <Radar data={data} options={options} />;
}

export function RadarWeekdayChart({ chartData, cinemas, colors }) {
	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "bottom",
			},
		},
	};

	const data = {
		labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
		datasets: chartData?.map((cinema, idx) => {
			return {
				label: cinemas[idx].name,
				data: cinema.map((month) => month.revenue),
				backgroundColor: `rgba(${colors[idx]} , 0.5)`,
				borderColor: `rgba(${colors[idx]} , 1)`,
			};
		}),
	};

	return <Radar data={data} options={options} />;
}

export function RadarMonthChart({ chartData, cinemas, colors }) {
	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "bottom",
			},
		},
	};

	const data = {
		labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		datasets: chartData?.map((cinema, idx) => {
			return {
				label: cinemas[idx].name,
				data: cinema.map((month) => month.revenue),
				backgroundColor: `rgba(${colors[idx]} , 0.5)`,
				borderColor: `rgba(${colors[idx]} , 1)`,
			};
		}),
	};

	return <Radar data={data} options={options} />;
}
