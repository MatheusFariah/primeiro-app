"use client";

import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip as RechartsTooltip,
  LabelList,
  TooltipProps,
} from "recharts";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { FaBullseye, FaCrosshairs, FaFutbol } from "react-icons/fa";

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
  goals_conceded?: number;
  saves?: number;
  clean_sheets?: number;
  penalties_saved?: number;
  penalties_faced?: number;
  high_claims?: number;
}

interface StatConfig {
  key: keyof PlayerStats;
  label: string;
  max: number;
  weight: number;
  invert?: boolean;
}

const positionProfiles: Record<
  string,
  {
    radarStats: StatConfig[];
    pieStats: {
      label: string;
      key: keyof PlayerStats;
      type: "success" | "error";
    }[];
    barStats: {
      label: string;
      key: keyof PlayerStats;
      type: "success" | "error";
    }[];
    barTitle: string;
  }
> = {
  GOL: {
    radarStats: [
      { key: "matches_played", label: "Partidas", max: 38, weight: 1 },
      { key: "saves", label: "Defesas", max: 150, weight: 2 },
      {
        key: "goals_conceded",
        label: "Gols sofridos",
        max: 20,
        weight: 2,
        invert: true,
      },
      { key: "penalties_saved", label: "Pênaltis salvos", max: 5, weight: 1.5 },
      { key: "high_claims", label: "Cruzamentos", max: 50, weight: 1 },
    ],
    pieStats: [
      { key: "saves", label: "Defesas", type: "success" },
      { key: "goals_conceded", label: "Gols sofridos", type: "error" },
    ],
    barStats: [
      { key: "penalties_faced", label: "Enfrentados", type: "error" },
      { key: "penalties_saved", label: "Defendidos", type: "success" },
    ],
    barTitle: "Pênaltis",
  },

  ZAG: {
    radarStats: [
      { key: "matches_played", label: "Partidas", max: 38, weight: 1 },
      { key: "interceptions", label: "Interceptações", max: 100, weight: 2 },
      { key: "correct_passes", label: "Passes certos", max: 400, weight: 1 },
      { key: "goals", label: "Gols", max: 5, weight: 0.8 },
      {
        key: "yellow_cards",
        label: "Amarelos",
        max: 10,
        weight: 1,
        invert: true,
      },
    ],
    pieStats: [
      { key: "correct_passes", label: "Passes certos", type: "success" },
      { key: "incorrect_passes", label: "Passes errados", type: "error" },
    ],
    barStats: [
      { key: "interceptions", label: "Interceptações", type: "success" },
    ],
    barTitle: "Interceptações",
  },

  VOL: {
    radarStats: [
      { key: "matches_played", label: "Partidas", max: 38, weight: 1 },
      { key: "interceptions", label: "Interceptações", max: 80, weight: 1.5 },
      { key: "correct_passes", label: "Passes certos", max: 500, weight: 1.5 },
      { key: "assists", label: "Assistências", max: 10, weight: 1.2 },
      {
        key: "yellow_cards",
        label: "Amarelos",
        max: 12,
        weight: 1,
        invert: true,
      },
    ],
    pieStats: [
      { key: "correct_passes", label: "Passes certos", type: "success" },
      { key: "incorrect_passes", label: "Passes errados", type: "error" },
    ],
    barStats: [
      { key: "interceptions", label: "Interceptações", type: "success" },
    ],
    barTitle: "Interceptações",
  },

  MEI: {
    radarStats: [
      { key: "matches_played", label: "Partidas", max: 38, weight: 1 },
      { key: "assists", label: "Assistências", max: 20, weight: 2 },
      { key: "goals", label: "Gols", max: 10, weight: 1.5 },
      { key: "dribbles", label: "Dribles", max: 60, weight: 1 },
      { key: "correct_passes", label: "Passes certos", max: 450, weight: 1.2 },
    ],
    pieStats: [
      { key: "correct_passes", label: "Passes certos", type: "success" },
      { key: "incorrect_passes", label: "Passes errados", type: "error" },
    ],
    barStats: [{ key: "assists", label: "Assistências", type: "success" }],
    barTitle: "Assistências",
  },

  ATA: {
    radarStats: [
      { key: "matches_played", label: "Partidas", max: 38, weight: 1 },
      { key: "goals", label: "Gols", max: 35, weight: 2 },
      { key: "assists", label: "Assistências", max: 20, weight: 1 },
      {
        key: "successful_shots",
        label: "Finalizações certas",
        max: 100,
        weight: 1.5,
      },
      { key: "dribbles", label: "Dribles", max: 70, weight: 1 },
    ],
    pieStats: [
      { key: "successful_shots", label: "Certas", type: "success" },
      { key: "unsuccessful_shots", label: "Erradas", type: "error" },
    ],
    barStats: [
      { key: "successful_shots", label: "Certas", type: "success" },
      { key: "unsuccessful_shots", label: "Erradas", type: "error" },
    ],
    barTitle: "Finalizações",
  },
};

// Mapear posições similares
["PE", "PD", "SA"].forEach(
  (p) => (positionProfiles[p] = { ...positionProfiles.ATA })
);
["LAT"].forEach((p) => (positionProfiles[p] = { ...positionProfiles.ZAG }));

interface StatsGraphsProps {
  stats: PlayerStats;
  position: string;
}

export default function StatsGraphs({ stats, position }: StatsGraphsProps) {
  const theme = useTheme();
  const profile = positionProfiles[position];

  const radarData = profile.radarStats.map(
    ({ key, label, max, weight, invert }) => {
      const raw = stats[key] ?? 0;
      const norm = Math.min((raw / max) * 100, 100);
      const value = invert ? 100 - norm : norm;
      return {
        label: `${label} (${raw})`,
        value: parseFloat((value * weight).toFixed(2)),
      };
    }
  );

  const pieData = profile.pieStats.map(({ key, label, type }) => ({
    label,
    value: stats[key] ?? 0,
    color:
      type === "success"
        ? theme.palette.success.main
        : theme.palette.error.main,
  }));

  const barData = [
    Object.fromEntries([
      ["name", profile.barTitle],
      ...profile.barStats.map(({ key }) => [key, stats[key] ?? 0]),
    ]),
  ];

  const totalPasses = stats.correct_passes + stats.incorrect_passes;
  const passPrecision = (
    (stats.correct_passes / (totalPasses || 1)) *
    100
  ).toFixed(1);

  const totalShots = stats.successful_shots + stats.unsuccessful_shots;
  const shotPrecision = (
    (stats.successful_shots / (totalShots || 1)) *
    100
  ).toFixed(1);

  const CustomTooltip = ({ payload }: TooltipProps<any, any>) => {
    if (!payload || payload.length === 0) return null;
    const item = payload[0];
    const name = item.payload.label || item.name;
    const value = item.value;

    return (
      <Box
        className="scrollbar-hidden"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "wrap", // ✅ Permite quebrar linha e evitar overflow
          gap: 3,
          px: 4,
          py: 4,
          width: "100%",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#e0e0e0",
            fontWeight: 500,
            fontSize: 13,
          }}
        >
          {name}: {value}
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      className="scrollbar-hidden"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: 3,
        px: 4,
        py: 4,
        width: "100%",
        overflowX: "auto",
        scrollBehavior: "smooth",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Gráfico de Pizza */}
      <Card
        sx={{
          bgcolor: "#0f0f1a",
          color: "#e0e0e0",
          borderRadius: 6,
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
          p: 3,
          flex: 1,
          minWidth: 320,
          maxWidth: 380,
          height: 460,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardHeader
          avatar={<FaBullseye color={theme.palette.success.main} size={18} />}
          title="Precisão de passes"
          titleTypographyProps={{
            variant: "subtitle1",
            sx: {
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
            },
          }}
          sx={{ pb: 0 }}
        />

        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 220,
              height: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <defs>
                  <filter
                    id="shadow"
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="120%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="2"
                      stdDeviation="4"
                      floodColor="#000"
                      floodOpacity="0.3"
                    />
                  </filter>
                </defs>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius="100%"
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                  cornerRadius={6}
                  stroke="#0f0f1a"
                  strokeWidth={2}
                  filter="url(#shadow)"
                  animationDuration={800}
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>

                <RechartsTooltip
                  content={(args) => <CustomTooltip {...args} />}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              mt: 2,
            }}
          >
            {pieData.map((entry) => (
              <Box
                key={entry.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: entry.color,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    color: "#ccc",
                    fontSize: 13,
                  }}
                >
                  {entry.label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography
            variant="subtitle2"
            align="center"
            sx={{
              mt: 2,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              color: theme.palette.success.main,
            }}
          >
            Precisão nos passes
          </Typography>
        </CardContent>
      </Card>

      {/* Gráfico Radar */}
      <Card
        sx={{
          bgcolor: "#1f1f2d",
          color: "#e0e0e0",
          borderRadius: 6,
          boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
          p: 3,
          flex: 1,
          minWidth: 320,
          maxWidth: 380,
          height: 460,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardHeader
          avatar={<FaFutbol color={theme.palette.success.main} />}
          title="Desempenho geral"
          titleTypographyProps={{
            variant: "subtitle1",
            sx: { fontWeight: 700, color: "#fff" },
          }}
          sx={{ pb: 0 }}
        />
        <CardContent sx={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <defs>
                <linearGradient id="radarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={theme.palette.success.main}
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="100%"
                    stopColor={theme.palette.success.main}
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis
                dataKey="label"
                stroke="#888"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <PolarRadiusAxis tick={false} axisLine={false} tickLine={false} />
              <Radar
                name="Indicador"
                dataKey="value"
                stroke="url(#radarGrad)"
                fill="url(#radarGrad)"
                fillOpacity={1}
                animationDuration={1000}
              />
              <RechartsTooltip
                content={(args) => <CustomTooltip {...args} />}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Barras */}
      <Card
        sx={{
          bgcolor: "#1f1f2d",
          color: "#e0e0e0",
          borderRadius: 6,
          boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
          p: 3,
          flex: 1,
          minWidth: 320,
          maxWidth: 380,
          height: 460,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardHeader
          avatar={<FaCrosshairs color={theme.palette.success.main} />}
          title={profile.barTitle}
          titleTypographyProps={{
            variant: "subtitle1",
            sx: { fontWeight: 700, color: "#fff" },
          }}
          sx={{ pb: 0 }}
        />
        <CardContent sx={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barSize={35}>
              <defs>
                <linearGradient id="barSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.palette.success.light} />
                  <stop offset="100%" stopColor={theme.palette.success.dark} />
                </linearGradient>
                <linearGradient id="barError" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.palette.error.light} />
                  <stop offset="100%" stopColor={theme.palette.error.dark} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#2a2a2a" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#ddd", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#ddd" }}
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip
                content={(args) => <CustomTooltip {...args} />}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ color: "#bbb", fontSize: 13, marginTop: 12 }}
              />
              {Object.keys(barData[0])
                .filter((k) => k !== "name")
                .map((key, i) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={i % 2 === 0 ? "url(#barSuccess)" : "url(#barError)"}
                    radius={[10, 10, 0, 0]}
                    animationDuration={900}
                  >
                    <LabelList
                      dataKey={key}
                      position="top"
                      style={{
                        fill: "#fff",
                        fontSize: 12,
                        textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                      }}
                    />
                  </Bar>
                ))}
            </BarChart>
          </ResponsiveContainer>
          {profile.barTitle === "Finalizações" && (
            <Typography
              variant="h5"
              align="center"
              sx={{
                mt: 2,
                color: theme.palette.success.main,
                fontFamily: "'Inter', sans-serif",
                textShadow: "0 1px 2px rgba(0,0,0,0.6)",
              }}
            >
              {shotPrecision}% de precisão
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
