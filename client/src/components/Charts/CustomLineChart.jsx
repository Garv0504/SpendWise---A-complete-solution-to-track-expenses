import React from "react";
import {
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Area,
	AreaChart,
} from "recharts";

const CustomLineChart = ({ chartData }) => {
	const customTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
					<p className="text-xs font-semibold text-primary mb-1">
						{payload[0].payload.category}
					</p>
					<p className="text-sm text-[#222831]">
						Amount :{" "}
						<span className="text-sm font-medium text-gray-900">
							₹ {payload[0].payload.amount}
						</span>
					</p>
				</div>
			);
		}
	};

	return (
		<div className="bg-[#222831]">
			<ResponsiveContainer width="100%" height={400}>
				<AreaChart data={chartData}>
					<defs>
						<linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#00ADB5" stopOpacity={0.4} />
							<stop offset="95%" stopColor="#00ADB5" stopOpacity={0} />
						</linearGradient>
					</defs>

					<CartesianGrid stroke="none" />
					<XAxis
						dataKey="month"
						tick={{ fontSize: 12, fill: "#EEEEEE" }}
						stroke="none"
					/>
					<YAxis tick={{ fontSize: 12, fill: "#EEEEEE" }} stroke="none" />
					<Tooltip content={customTooltip} />

					<Area
						type="monotone"
						dataKey="amount"
						stroke="#00ADB5"
						fill="url(#incomeGradient)"
						strokeWidth={3}
						dot={{ r: 3, fill: "#EEEEEE" }}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};

export default CustomLineChart;
