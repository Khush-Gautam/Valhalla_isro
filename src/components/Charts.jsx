import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const DRIVER_COLORS = {
  Vegetation: "#1baf7a",
  Buildings: "#e34948",
  Roads: "#eda100",
};

export default function DriverBarChart({ data }) {
  return (
    <div className="h-[120px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid horizontal={false} stroke="#1a212e" />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="name"
            width={70}
            tick={{ fill: "#7c8597", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            contentStyle={{
              background: "#0e121a",
              border: "1px solid #252e3f",
              borderRadius: 6,
              fontSize: 12,
              fontFamily: "JetBrains Mono, monospace",
            }}
            labelStyle={{ color: "#e6e9ef" }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
            {data.map((d) => (
              <Cell key={d.name} fill={DRIVER_COLORS[d.name] || "#3a4456"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BeforeAfterChart({ data }) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#1a212e" vertical={false} />
          <XAxis
            dataKey="zone"
            tick={{ fill: "#7c8597", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}
            axisLine={{ stroke: "#252e3f" }}
            tickLine={false}
            interval={Math.max(0, Math.floor(data.length / 8) - 1)}
          />
          <YAxis
            tick={{ fill: "#7c8597", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}
            axisLine={false}
            tickLine={false}
            domain={["dataMin - 2", "dataMax + 2"]}
            unit="°C"
          />
          <Tooltip
            contentStyle={{
              background: "#0e121a",
              border: "1px solid #252e3f",
              borderRadius: 6,
              fontSize: 12,
              fontFamily: "JetBrains Mono, monospace",
            }}
            labelStyle={{ color: "#e6e9ef" }}
          />
          <Legend wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }} />
          <Line
            type="monotone"
            dataKey="before"
            name="Before"
            stroke="#e24b4a"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="after"
            name="After"
            stroke="#1baf7a"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
