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
} from "recharts";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { FaBullseye, FaCrosshairs, FaFutbol } from "react-icons/fa";
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
  position?: string;
}

interface StatsGraphsProps {
  stats: PlayerStats;
}

export default function StatsGraphs({ stats }: StatsGraphsProps) {
  const theme = useTheme();
  const isGoalkeeper =
    stats.position === "GOL" ||
    (stats.saves ?? 0) > 0 ||
    (stats.goals_conceded ?? 0) > 0;

  // precision calcs
  const totalPasses = stats.correct_passes + stats.incorrect_passes;
  const passPrecision = ((stats.correct_passes / (totalPasses || 1)) * 100).toFixed(1);

  const totalShots = stats.successful_shots + stats.unsuccessful_shots;
  const shotPrecision = ((stats.successful_shots / (totalShots || 1)) * 100).toFixed(1);

  // chart data
  const pieData = isGoalkeeper
    ? [
        { label: "Defesas", value: stats.saves ?? 0, color: theme.palette.success.main },
        { label: "Gols sofridos", value: stats.goals_conceded ?? 0, color: theme.palette.error.main },
      ]
    : [
        { label: "Passes certos", value: stats.correct_passes, color: theme.palette.success.main },
        { label: "Passes errados", value: stats.incorrect_passes, color: theme.palette.error.main },
      ];

  const radarData = isGoalkeeper
    ? [
        { label: "Partidas", value: stats.matches_played, visualValue: 100 },
        {
          label: "Defesas",
          value: stats.saves ?? 0,
          visualValue: Math.max(Math.min((stats.saves ?? 0) / 150 * 100, 100), 10),
        },
        {
          label: "Gols sofridos",
          value: stats.goals_conceded ?? 0,
          visualValue: Math.max(100 - ((stats.goals_conceded ?? 0) / 20) * 100, 10),
        },
        {
          label: "Penâltis salvos",
          value: stats.penalties_saved ?? 0,
          visualValue: Math.max(Math.min((stats.penalties_saved ?? 0) / 5 * 100, 100), 10),
        },
        {
          label: "Cruzamentos",
          value: stats.high_claims ?? 0,
          visualValue: Math.max(Math.min((stats.high_claims ?? 0) / 50 * 100, 100), 10),
        },
      ]
    : [
        { label: "Partidas", value: stats.matches_played, visualValue: 100 },
        {
          label: "Gols",
          value: stats.goals,
          visualValue: Math.max(Math.min(stats.goals / 35 * 100, 100), 10),
        },
        {
          label: "Assistências",
          value: stats.assists,
          visualValue: Math.max(Math.min(stats.assists / 35 * 100, 100), 10),
        },
        {
          label: "Desarmes",
          value: stats.interceptions,
          visualValue: Math.max(Math.min(stats.interceptions / 60 * 100, 100), 10),
        },
        {
          label: "Dribles",
          value: stats.dribbles,
          visualValue: Math.max(Math.min(stats.dribbles / 60 * 100, 100), 10),
        },
      ];

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

  // custom tooltip
  const CustomTooltip = ({ payload }: { payload?: any[] }) => {
    const pp = payload ?? [];
    if (!pp.length) return null;
    const { label, value } = pp[0].payload;
    return (
      <Box
        sx={{
          bgcolor: "#1A1A1A",
          border: `1px solid ${theme.palette.success.main}`,
          borderRadius: 1,
          p: 1,
          color: theme.palette.success.main,
          boxShadow: 3,
        }}
      >
        <Typography variant="caption">
          {label}: {value}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        {/* PIE */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
          >
            <Card sx={{ height: 400, bgcolor: "#111827", color: "#FFF" }}>
              <CardHeader
                avatar={<FaBullseye color={theme.palette.success.main} />}
                title="Precisão de passes"
                titleTypographyProps={{ variant: "subtitle1", color: "inherit" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height={220}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="label"
                      innerRadius="40%"
                      outerRadius="70%"
                      paddingAngle={4}
                      startAngle={90}
                      endAngle={-270}
                      isAnimationActive
                      animationDuration={1000}
                      cornerRadius={8}
                    >
                      {pieData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={(args) => <CustomTooltip {...args} />} />
                    <Legend
                      verticalAlign="bottom"
                      iconType="square"
                      wrapperStyle={{ color: "#ccc", fontSize: 12 }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <Typography
                  variant="h5"
                  align="center"
                  sx={{ mt: 2, color: theme.palette.success.main }}
                >
                  {passPrecision}% de precisão
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* RADAR */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
          >
            <Card sx={{ height: 400, bgcolor: "#111827", color: "#FFF" }}>
              <CardHeader
                avatar={<FaFutbol color={theme.palette.success.main} />}
                title="Desempenho geral"
                titleTypographyProps={{ variant: "subtitle1", color: "inherit" }}
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <defs>
                      <linearGradient id="radarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={theme.palette.success.main} stopOpacity={0.7} />
                        <stop offset="100%" stopColor={theme.palette.success.main} stopOpacity={0.2} />
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
                      dataKey="visualValue"
                      stroke="url(#radarGrad)"
                      fill="url(#radarGrad)"
                      fillOpacity={1}
                      animationDuration={1000}
                    />
                    <RechartsTooltip content={(args) => <CustomTooltip {...args} />} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* BAR */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
          >
            <Card sx={{ height: 400, bgcolor: "#111827", color: "#FFF" }}>
              <CardHeader
                avatar={<FaCrosshairs color={theme.palette.success.main} />}
                title={isGoalkeeper ? "Pênaltis" : "Finalizações"}
                titleTypographyProps={{ variant: "subtitle1", color: "inherit" }}
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#2a2a2a" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#ccc" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#ccc" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <RechartsTooltip content={(args) => <CustomTooltip {...args} />} />
                    <Legend
                      verticalAlign="bottom"
                      iconType="square"
                      wrapperStyle={{ color: "#ccc", fontSize: 12 }}
                    />
                    {Object.keys(barData[0])
                      .filter((k) => k !== "name")
                      .map((key, i) => (
                        <Bar
                          key={key}
                          dataKey={key}
                          fill={i % 2 === 0 ? theme.palette.success.main : theme.palette.error.main}
                          radius={[8, 8, 0, 0]}
                          animationDuration={1000}
                        />
                      ))}
                  </BarChart>
                </ResponsiveContainer>
                {!isGoalkeeper && (
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{ mt: 2, color: theme.palette.success.main }}
                  >
                    {shotPrecision}% de precisão
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
