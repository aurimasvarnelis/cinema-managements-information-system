import { ArcElement, CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, Plugin, PointElement, Title, Tooltip } from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function LineChart({ chartData, cinemas, colors }) {
	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "bottom",
			},
		},
	};

	const data = {
		labels: monthNames,
		datasets: chartData?.map((cinema, idx) => {
			return {
				label: cinemas[idx].name,
				//labels: cinema.map((movie) => movie.name),
				data: cinema.map((month) => month.revenue),
				backgroundColor: `rgba(${colors[idx]} , 0.5)`,
				borderColor: `rgba(${colors[idx]} , 1)`,
			};
		}),
	};

	return <Line data={data} options={options} />;
}
