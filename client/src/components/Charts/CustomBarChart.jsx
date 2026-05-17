import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Cell,
} from "recharts";

const CustomBarChart = ({ data }) => {
	const getBarColor = (index) => {
		return index % 2 === 0 ? "#00ADB5" : "#FFFFFF";
	};

    const CustomToolTip = ({active, payload}) => {
        if(active && payload && payload.length) {
            return (
                <div className="bg-white shadow-md rounded-lg p-2 border-gray-300">
                    <p className="text-xs font-semibold text-primary mb-1">{payload[0].payload.category}</p>
                    <p className="text-sm text-gray-600">
                        Amount: <span className="text-sm font-medium text-[#222831]">₹{payload[0].payload.amount}</span>
                    </p>
                </div>
            )
        }
    }
	return (
		<div className="bg-[#222831] mt-6">
			<ResponsiveContainer width="100%" height={380}>
				<BarChart data={data}>
					<CartesianGrid stroke="none" />

					<XAxis
						dataKey="month"
						tick={{ fontSize: 12, fill: "#EEEEEE" }}
						stroke="none"
					/>
					<YAxis tick={{ fontSize: 12, fill: "#EEEEEE" }} stroke="none" />

					<Tooltip content={CustomToolTip} />

					<Bar
						dataKey="amount"
						radius={[10, 10, 0, 0]}
					>
						{data.map((entry, index) => (
							<Cell key={index} fill={getBarColor(index)}/>
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default CustomBarChart;
