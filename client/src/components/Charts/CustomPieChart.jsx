import React from "react";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import CustomToolTip from "./CustomToolTip";
import CustomLegend from "./CustomLegend";

const CustomPieChart = ({
	data,
	label,
	totalAmount,
	color,
	showTextAnchor,
}) => {
	return (
		<ResponsiveContainer width="100%" height={380}>
			<PieChart>
				<Pie
					data={data}
					dataKey="amount"
					nameKey="name"
					cx="50%"
					cy="50%"
					outerRadius={150}
					innerRadius={100}
					labelLine={false}
				>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={color[index % color.length]} />
					))}
				</Pie>
				<Tooltip content={<CustomToolTip/>}/>
				<Legend content={<CustomLegend/>}/>

				{showTextAnchor && (
					<g>
						<text
							x="50%"
							y="50%"
							dy={-25}
							textAnchor="middle"
							fill="#00ADB5"
							fontSize="14px"
							style={{ backgroundColor: 'red' }}
						>
							{label}
						</text>
						<text
							x="50%"
							y="50%"
							dy={8}
							textAnchor="middle"
							fill="#EEEEEE"
							fontSize="24px"
							fontWeight="semi-bold"
						>
							{totalAmount}
						</text>
					</g>
				)}
			</PieChart>
		</ResponsiveContainer>
	);
};

export default CustomPieChart;
