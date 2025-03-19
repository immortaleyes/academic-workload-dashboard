
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Workload } from "@/types/faculty";

interface WorkloadChartProps {
  workload: Workload;
}

export const WorkloadChart: React.FC<WorkloadChartProps> = ({ workload }) => {
  const data = [
    { name: "Teaching", value: workload.teachingHours, color: "#3b82f6" },
    { name: "Lab", value: workload.labHours, color: "#10b981" },
    { name: "Meetings", value: workload.meetingHours, color: "#f59e0b" },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
          animationDuration={800}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color} 
              stroke="none"
              className="transition-opacity duration-300 hover:opacity-80"
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value} hours`, null]}
          contentStyle={{
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: 'none',
            padding: '8px 12px',
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
