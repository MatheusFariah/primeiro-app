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
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";

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
  const isGoalkeeper =
    position === "GOL" ||
    (stats.saves ?? 0) > 0 ||
    (stats.goals_conceded ?? 0) > 0;

  const profile = positionProfiles[position];

  // Cálculo de precisão
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

  // Radar
  const radarData = profile.radarStats.map(
    ({ key, label, max, weight, invert }) => {
      const raw = stats[key as keyof PlayerStats] ?? 0;
      const norm = Math.min((raw / max) * 100, 100);
      const value = invert ? 100 - norm : norm;
      return {
        label: `${label} (${raw})`,
        value: parseFloat((value * weight).toFixed(2)),
      };
    }
  );

  // Pie
  const pieData = isGoalkeeper
    ? [
        {
          label: "Defesas",
          value: stats.saves ?? 0,
          color: theme.palette.success.main,
        },
        {
          label: "Gols sofridos",
          value: stats.goals_conceded ?? 0,
          color: theme.palette.error.main,
        },
      ]
    : [
        {
          label: "Passes certos",
          value: stats.correct_passes,
          color: theme.palette.success.main,
        },
        {
          label: "Passes errados",
          value: stats.incorrect_passes,
          color: theme.palette.error.main,
        },
      ];

  // Bar
  const barData = isGoalkeeper
    ? [
        {
          name: "Pênaltis",
          Enfrentados: stats.penalties_faced ?? 0,
          Defendidos: stats.penalties_saved ?? 0,
        },
      ]
    : [
        {
          name: "Finalizações",
          Certas: stats.successful_shots,
          Erradas: stats.unsuccessful_shots,
        },
      ];

  // Tooltip
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
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 3,
        px: 4,
        py: 0, // 🔥 Subi mais o conteúdo, fica mais enxuto
        width: "100%",
        overflowX: "auto",
        scrollBehavior: "smooth",
        scrollbarWidth: "none", // 🔥 Some a scrollbar padrão Firefox
        "&::-webkit-scrollbar": { display: "none" }, // 🔥 Some a scrollbar no Chrome/Safari
        fontFamily: "'Inter', sans-serif",
        flexWrap: "nowrap", // 🔥 Mantém os cards lado a lado sem quebra
      }}
    >
      <Card
        sx={{
          bgcolor: "#1f1f2d",
          color: "#e0e0e0",
          borderRadius: 6,
          boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
          p: 3,
          flex: "1 0 360px",
          maxWidth: 400,
          height: 400,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardHeader
          avatar={<FaBullseye color={theme.palette.success.main} />}
          title="Precisão de passes"
          titleTypographyProps={{
            variant: "subtitle1",
            sx: { fontWeight: 700, color: "#fff" },
          }}
          sx={{ pb: 0 }}
        />

        <CardContent sx={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height={260}>
            <RechartsPieChart>
              <defs>
                <linearGradient id="passCorrect" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00c851" />
                  <stop offset="100%" stopColor="#007E33" />
                </linearGradient>
                <linearGradient id="passWrong" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff4444" />
                  <stop offset="100%" stopColor="#CC0000" />
                </linearGradient>
                <filter
                  id="shadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feDropShadow
                    dx="0"
                    dy="4"
                    stdDeviation="4"
                    floodColor="#000"
                    floodOpacity="0.4"
                  />
                </filter>
              </defs>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="label"
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
                cornerRadius={0}
                stroke="none"
                animationDuration={900}
                filter="url(#shadow)"
              >
                <Cell fill="url(#passCorrect)" />
                <Cell fill="url(#passWrong)" />
              </Pie>

              <Legend
                verticalAlign="top"
                align="center"
                iconType="circle"
                wrapperStyle={{
                  color: "#bbb",
                  fontSize: 13,
                  display: "flex",
                  justifyContent: "center",
                  gap: 30,
                  paddingBottom: 10,
                }}
              />

              <RechartsTooltip
                wrapperStyle={{ outline: "none" }}
                contentStyle={{
                  backgroundColor: "rgba(17,17,17,0.85)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
                  backdropFilter: "blur(8px)",
                }}
                itemStyle={{
                  color: "#fff",
                  fontSize: 12,
                }}
                labelStyle={{
                  color: "#bbb",
                  fontWeight: 600,
                  fontSize: 12,
                }}
                cursor={{ fill: "transparent" }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>

          <Typography
            variant="h5"
            align="center"
            sx={{
              mt: 2,
              color: theme.palette.success.main,
              textShadow: "0 1px 2px rgba(0,0,0,0.8)",
            }}
          >
            {passPrecision}% de precisão
          </Typography>
        </CardContent>
      </Card>

      {/* RADAR */}
      <Card
        sx={{
          bgcolor: "#1f1f2d",
          color: "#e0e0e0",
          borderRadius: 6,
          boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
          p: 3,
          flex: "1 0 360px",
          maxWidth: 400,
          height: 400,
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
                name="Desempenho"
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

      {/* BAR */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        style={{
          flex: "1 0 360px",
          maxWidth: 400,
          height: 400,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Card
          sx={{
            bgcolor: "#1f1f2d",
            color: "#e0e0e0",
            borderRadius: 6,
            p: 3,
            boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
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
          <CardContent
            sx={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  barSize={35}
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                  {/* Definição de gradientes e sombra */}
                  <defs>
                    <linearGradient id="barSuccess" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={theme.palette.success.light}
                      />
                      <stop
                        offset="100%"
                        stopColor={theme.palette.success.dark}
                      />
                    </linearGradient>
                    <linearGradient id="barError" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={theme.palette.error.light} />
                      <stop
                        offset="100%"
                        stopColor={theme.palette.error.dark}
                      />
                    </linearGradient>
                    <filter
                      id="shadow"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="2"
                        stdDeviation="2"
                        floodColor="#000"
                        floodOpacity="0.4"
                      />
                    </filter>
                  </defs>

                  {/* Grid */}
                  <CartesianGrid stroke="#2a2a2a" vertical={false} />

                  {/* Eixo X */}
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#ddd", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  {/* Eixo Y */}
                  <YAxis
                    domain={[0, "dataMax + 5"]}
                    tick={{ fontSize: 12, fill: "#ddd" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  {/* Tooltip */}
                  <RechartsTooltip
                    wrapperStyle={{ outline: "none" }}
                    contentStyle={{
                      backgroundColor: "rgba(17,17,17,0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
                      backdropFilter: "blur(8px)",
                    }}
                    itemStyle={{
                      color: "#fff",
                      fontSize: 12,
                      border: "none",
                    }}
                    labelStyle={{
                      color: "#ccc",
                      fontWeight: 600,
                      fontSize: 12,
                      border: "none",
                    }}
                  />

                  {/* Legenda */}
                  <Legend
                    verticalAlign="top"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{
                      color: "#bbb",
                      fontSize: 13,
                      paddingBottom: 10,
                    }}
                  />

                  {/* Barras */}
                  {Object.keys(barData[0])
                    .filter((k) => k !== "name")
                    .map((key, i) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        fill={
                          i % 2 === 0 ? "url(#barSuccess)" : "url(#barError)"
                        }
                        radius={[8, 8, 0, 0]}
                        style={{ filter: "url(#shadow)" }}
                        animationDuration={900}
                      />
                    ))}
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {profile.barTitle === "Finalizações" && (
              <Typography
                variant="h5"
                align="center"
                sx={{
                  mt: 0,
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
      </motion.div>
    </Box>
  );
}
