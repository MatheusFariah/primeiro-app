"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  PolarRadiusAxis,
} from "recharts";
import { FaBullseye, FaCrosshairs, FaFutbol } from "react-icons/fa";
import { PieChart } from "@mui/x-charts";

interface PlayerStats {
  matches_played: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  correct_passes: number;
  incorrect_passes: number;
  successful_shots: number;
  unsuccessful_shots: number;
  interceptions: number;
  dribbles: number;
}

interface StatsGraphsProps {
  stats: PlayerStats;
}

export default function StatsGraphs({ stats }: StatsGraphsProps) {
  const passPrecision = (
    (stats.correct_passes /
      (stats.correct_passes + stats.incorrect_passes || 1)) *
    100
  ).toFixed(1);

  const totalShots = stats.successful_shots + stats.unsuccessful_shots || 1;
  const shotPrecision = ((stats.successful_shots / totalShots) * 100).toFixed(
    1
  );

  const radarData = [
    {
      label: "Partidas",
      value: stats.matches_played,
      visualValue: 100,
    },
    {
      label: "Gols",
      value: stats.goals,
      visualValue: Math.min((stats.goals / 35) * 100, 100),
    },
    {
      label: "Assistências",
      value: stats.assists,
      visualValue: Math.min((stats.assists / 35) * 100, 100),
    },
    {
      label: "Desarmes",
      value: stats.interceptions,
      visualValue: Math.min((stats.interceptions / 40) * 100, 100),
    },
    {
      label: "Dribles",
      value: stats.dribbles,
      visualValue: Math.min((stats.dribbles / 60) * 100, 100),
    },
  ];

  const barData = [
    {
      name: "Finalizações",
      Certas: stats.successful_shots,
      Erradas: stats.unsuccessful_shots,
    },
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        {/* Precisão de Passes */}
        <div className="relative group transition duration-700 ease-out transform-gpu animate-fade-in-up hover:scale-[1.03] h-full">
          <div className="absolute opacity-40 bg-gradient-to-tr from-green-400/20 to-pink-500/10 rounded-3xl z-0" />
          <div className="relative z-10 p-6 rounded-3xl border border-gray-700 shadow-lg backdrop-blur-md h-full flex flex-col justify-between items-center">
            <h4 className="text-center text-sm text-gray-300 mb-2 flex items-center justify-center gap-2">
              <FaBullseye className="text-highlight-green" />
              Precisão de Passes
            </h4>
            <PieChart
              series={[
                {
                  innerRadius: 50,
                  outerRadius: 80,
                  paddingAngle: 3,
                  highlightScope: { fade: "none", highlight: "none" },
                  faded: { additionalRadius: 0, color: "transparent" },
                  data: [
                    {
                      id: 0,
                      value: stats.correct_passes,
                      label: "Passes certos",
                      color: "#00FF88",
                    },
                    {
                      id: 1,
                      value: stats.incorrect_passes,
                      label: "Passes errados",
                      color: "#FF4D4D",
                    },
                  ],
                },
              ]}
              width={200}
              height={200}
              sx={{
                "& .MuiChartsTooltip-root": { display: "none !important" },
                "& .MuiPieArc-root": {
                  filter: "none !important",
                  stroke: "#1a1a1a",
                  strokeWidth: 2,
                },
                "& .MuiChartsLegend-root": { display: "none" },
              }}
            />
            <div className="flex justify-center gap-6 mt-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-[#00FF88]" />
                Passes certos
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-[#FF4D4D]" />
                Passes errados
              </div>
            </div>
            <p className="text-center mt-3 text-highlight-green font-bold text-xl tracking-wide">
              {passPrecision}% de precisão
            </p>
          </div>
        </div>

        {/* Desempenho Geral */}
        <div className="relative group transition duration-700 ease-out transform-gpu animate-zoom-fade-in hover:scale-[1.03] h-full delay-150">
          <div className="absolute opacity-40 bg-gradient-to-bl from-blue-500/20 to-purple-400/10 rounded-3xl z-0" />
          <div className="relative z-10 p-6 rounded-3xl border border-gray-700 shadow-lg backdrop-blur-md h-full">
            <h4 className="text-center text-sm text-gray-300 mb-4 flex items-center justify-center gap-2">
              <FaFutbol className="text-highlight-green" />
              Desempenho Geral
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#444" />
                <PolarAngleAxis
                  dataKey="label"
                  stroke="#ccc"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <PolarRadiusAxis
                  tick={false}
                  axisLine={false}
                  tickLine={false}
                />
                <Radar
                  name="Desempenho"
                  dataKey="visualValue"
                  stroke="#00FF88"
                  fill="#00FF88"
                  fillOpacity={0.5}
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    fill: "#00FF88",
                    stroke: "#1a1a1a",
                    strokeWidth: 1,
                  }}
                />
                <RechartsTooltip
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const item = payload[0];
                    return (
                      <div
                        className="bg-[#1a1a1a] border border-highlight-green rounded-xl px-3 py-1 text-highlight-green text-sm font-semibold shadow-md"
                        style={{ pointerEvents: "none" }}
                      >
                        {item.payload.label}: {item.payload.value}
                      </div>
                    );
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Finalizações */}
        <div className="relative group transition duration-700 ease-out transform-gpu animate-bounce-in hover:scale-[1.03] h-full delay-300">
          <div className="relative rounded-3xl bg-[#111827] border border-gray-700 shadow-lg backdrop-blur-md overflow-hidden p-6 h-full flex flex-col justify-between items-center">
            <h4 className="text-center text-sm text-gray-300 mb-4 flex items-center justify-center gap-2">
              <FaCrosshairs className="text-highlight-green" />
              Finalizações
            </h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={barData}
                barSize={40}
                margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid stroke="#2a2a2a" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#ccc"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#ccc"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #00FF88",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name: string) => [
                    `${value}`,
                    name,
                  ]}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: "13px",
                    paddingTop: "10px",
                    color: "#ffffff",
                  }}
                />
                <Bar
                  dataKey="Certas"
                  fill="#00FF88"
                  radius={[0, 0, 0, 0]}
                  animationDuration={2000}
                  label={{
                    position: "top",
                    fill: "#00FF88",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                />
                <Bar
                  dataKey="Erradas"
                  fill="#FF4D4D"
                  radius={[0, 0, 0, 0]}
                  animationDuration={2000}
                  label={{
                    position: "top",
                    fill: "#FF4D4D",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center mt-3 text-highlight-green font-bold text-xl tracking-wide">
              {shotPrecision}% de precisão
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
