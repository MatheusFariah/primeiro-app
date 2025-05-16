// utils/reportUtils.ts

// 📅 Formata a data no padrão brasileiro
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Data inválida";
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// 📊 Formata número como porcentagem
export const formatPercent = (value: number): string => `${value.toFixed(1)}%`;

// 🧮 Formata número com separador de milhar
export const formatNumber = (value: number): string =>
  value.toLocaleString("pt-BR");

// 🧾 Capitaliza a primeira letra de uma palavra
export const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

// 🧾 Capitaliza todas as palavras
export const capitalizeWords = (text: string): string =>
  text.replace(/\b\w/g, (char) => char.toUpperCase());


// zod/playerSchemas.ts
import { z } from "zod";

export const PlayerStatsSchema = z.object({
  partidas: z.number(),
  gols: z.number(),
  assistencias: z.number(),
  passesCertos: z.number(),
  passesErrados: z.number(),
  desarmes: z.number(),
  dribles: z.number(),
  amarelos: z.number(),
  vermelhos: z.number(),
  cruzamentos: z.number().optional(),
  defesas: z.number().optional(),
  golsSofridos: z.number().optional(),
  penaltisDefendidos: z.number().optional(),
  penaltisEnfrentados: z.number().optional(),
});

export type PlayerStats = z.infer<typeof PlayerStatsSchema>;

export const PlayerInfoSchema = z.object({
  nome: z.string(),
  posicao: z.string(),
  time: z.string(),
  temporada: z.string(),
  dataRelatorio: z.string(),
  nationality: z.string(),
  value: z.number(),
  join_date: z.string(),
});

export type PlayerInfo = z.infer<typeof PlayerInfoSchema>;


// Exemplo de uso em fetch
// const result = await supabase.from('player_statics').select('*').eq('players_id', id).single();
// const parsed = PlayerStatsSchema.safeParse(result.data);
// if (!parsed.success) console.error(parsed.error.format());
// else const stats = parsed.data;
