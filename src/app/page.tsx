"use client";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Trophy,
  Medal,
  User,
  Repeat,
  BarChart2,
} from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";
import clsx from "clsx";
import Table from "@/app/components/table";

type SortField = "goals" | "assists" | "ga_ratio";

interface League {
  id: number;
  name: string;
}

interface Player {
  id: number;
  name: string;
  position: string;
  nationality: string;
  teams_id: number;
  teams?: {
    id: number;
    name: string;
    leagues_id?: number;
  };
}
interface PlayerStatsRanking {
  players_id: number;
  goals: number;
  assists: number;
  matches_played: number;
  yellow_cards: number;
  red_cards: number;
  players: Player;
}

export default function HomeRankingPage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);
  const [stats, setStats] = useState<PlayerStatsRanking[]>([]);
  const [sortBy, setSortBy] = useState<SortField>("goals");
  const [sortDesc, setSortDesc] = useState(true);
  const [loading, setLoading] = useState(false);

  // Buscar ligas e setar a primeira selecionada
  useEffect(() => {
    async function fetchLeagues() {
      const { data, error } = await supabase.from("leagues").select("id, name");
      if (!error && data && data.length > 0) {
        setLeagues(data);
        setSelectedLeague(data[0].id); // seta a primeira liga
      }
    }
    fetchLeagues();
  }, []);

  // Buscar estatísticas dos jogadores da liga selecionada
  useEffect(() => {
    async function fetchStats() {
      if (!selectedLeague) {
        setStats([]);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from("player_statics")
        .select(`
          players_id,
          goals,
          assists,
          matches_played,
          yellow_cards,
          red_cards,
          players (
            id,
            name,
            position,
            nationality,
            teams_id,
            teams (
              id,
              name,
              leagues_id
            )
          )
        `);

      if (!error && data) {
        // Filtra só jogadores dessa liga
        const filtered = (data as any[])
          .filter(stat => stat.players?.teams?.leagues_id === selectedLeague)
          .map((stat) => ({
            ...stat,
            players: Array.isArray(stat.players) ? stat.players[0] : stat.players,
          }));
        setStats(filtered as PlayerStatsRanking[]);
      } else {
        setStats([]);
      }
      setLoading(false);
    }
    fetchStats();
  }, [selectedLeague]);

  // Calcula o ratio G/A
  const dataWithGA = stats.map((s) => ({
    ...s,
    ga_ratio: s.matches_played > 0 ? (s.goals + s.assists) / s.matches_played : 0,
  }));

  // Ordena os dados
  const sorted = [...dataWithGA].sort((a, b) => {
    if (sortBy === "ga_ratio") {
      return sortDesc ? b.ga_ratio - a.ga_ratio : a.ga_ratio - b.ga_ratio;
    }
    return sortDesc
      ? (b as any)[sortBy] - (a as any)[sortBy]
      : (a as any)[sortBy] - (b as any)[sortBy];
  });

  function PodiumIcon(pos: number) {
    if (pos === 0)
      return <Trophy className="text-yellow-400 inline w-5 h-5 mr-1" />;
    if (pos === 1)
      return <Medal className="text-gray-400 inline w-5 h-5 mr-1" />;
    if (pos === 2)
      return <Medal className="text-amber-700 inline w-5 h-5 mr-1" />;
    return <User className="text-white/30 inline w-5 h-5 mr-1" />;
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-10 transition-colors">
      <div className="max-w-6xl w-full mx-auto">
        {/* Apresentação */}
        <div className="space-y-4 text-center mb-10">
          <h2 className="text-5xl font-black text-white">
            Bem-vindo ao <span className="text-green-500">Futstatics</span>
          </h2>
          <h3 className="text-2xl font-semibold text-green-500">
            Ranking dos Artilheiros
          </h3>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Confira abaixo a elite dos goleadores! <b>Apenas os 10 maiores artilheiros</b> aparecem neste ranking exclusivo.<br />
            <span className="text-green-400">Clique nos títulos das colunas</span> para organizar como preferir.
          </p>
        </div>
        {/* Filtro de liga */}
        {leagues.length > 0 && (
          <div className="flex justify-center mb-8">
            <select
              className="px-4 py-2 bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-green-500"
              value={selectedLeague ?? ""}
              onChange={e => setSelectedLeague(e.target.value ? Number(e.target.value) : null)}
            >
              {leagues.map(league => (
                <option key={league.id} value={league.id}>{league.name}</option>
              ))}
            </select>
          </div>
        )}
        {/* Tabela de ranking */}
        <div className="rounded-3xl shadow-xl px-4 py-6">
          {loading ? (
            <div className="text-center text-green-400 text-lg py-16">Carregando...</div>
          ) : (
            <Table>
              <thead>
                <tr className="bg-[#0e1625] text-slate-200 text-base select-none">
                  <th className="px-3 py-2 font-normal">#</th>
                  <th className="px-3 py-2 font-normal">
                    <span className="flex items-center gap-2 justify-center">
                      <User className="inline w-5 h-5 mb-0.5" />
                      JOGADOR
                    </span>
                  </th>
                  <th className="px-3 py-2 font-normal">
                    <span className="flex items-center gap-2 justify-center">
                      <BarChart2 className="inline w-5 h-5 mb-0.5" />
                      POSIÇÃO
                    </span>
                  </th>
                  <th className="px-3 py-2 font-normal">
                    <span className="flex items-center gap-2 justify-center">
                      <Trophy className="inline w-5 h-5 mb-0.5" />
                      TIME
                    </span>
                  </th>
                  <th
                    className="px-3 py-2 font-normal cursor-pointer hover:text-green-400 transition"
                    onClick={() => { setSortBy("goals"); setSortDesc(sortBy === "goals" ? !sortDesc : true); }}
                  >
                    <span className="flex items-center gap-2 justify-center">
                      <Trophy className="inline w-5 h-5 mb-0.5" />
                      GOLS
                      {sortBy === "goals" && (sortDesc ? <ArrowDown className="inline w-4 h-4" /> : <ArrowUp className="inline w-4 h-4" />)}
                    </span>
                  </th>
                  <th
                    className="px-3 py-2 font-normal cursor-pointer hover:text-green-400 transition"
                    onClick={() => { setSortBy("assists"); setSortDesc(sortBy === "assists" ? !sortDesc : true); }}
                  >
                    <span className="flex items-center gap-2 justify-center">
                      <Repeat className="inline w-5 h-5 mb-0.5" />
                      ASSIST.
                      {sortBy === "assists" && (sortDesc ? <ArrowDown className="inline w-4 h-4" /> : <ArrowUp className="inline w-4 h-4" />)}
                    </span>
                  </th>
                  <th
                    className="px-3 py-2 font-normal cursor-pointer hover:text-green-400 transition"
                    onClick={() => { setSortBy("ga_ratio"); setSortDesc(sortBy === "ga_ratio" ? !sortDesc : true); }}
                  >
                    <span className="flex items-center gap-2 justify-center">
                      <BarChart2 className="inline w-5 h-5 mb-0.5" />
                      G/A
                      {sortBy === "ga_ratio" && (sortDesc ? <ArrowDown className="inline w-4 h-4" /> : <ArrowUp className="inline w-4 h-4" />)}
                    </span>
                  </th>
                  <th className="px-3 py-2 font-normal text-center">
                    <span className="flex items-center gap-1 justify-center">
                      <span className="inline-block w-3 h-3 bg-yellow-400 rounded-sm" />
                      <span className="inline-block w-3 h-3 bg-red-600 rounded-sm" />
                      CARTÕES
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-gray-950">
                {sorted.slice(0, 10).length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      Nenhum jogador encontrado nesta liga.
                    </td>
                  </tr>
                ) : (
                  sorted.slice(0, 10).map((row, idx) => (
                    <tr
                      key={row.players_id}
                      className={clsx(
                        idx === 0 && "bg-yellow-100/5",
                        idx === 1 && "bg-blue-800/10",
                        idx === 2 && "bg-green-800/10",
                        "hover:bg-gray-900 transition duration-150 text-white"
                      )}
                    >
                      <td className="px-6 py-3 font-bold">{PodiumIcon(idx)} {idx + 1}</td>
                      <td className="px-6 py-3 flex items-center gap-2 font-semibold">
                        <img
                          src={`https://flagcdn.com/w20/${row.players.nationality?.toLowerCase()}.png`}
                          alt={row.players.nationality}
                          className="w-6 h-4 rounded-sm border border-white/10"
                        />
                        <span>{row.players.name}</span>
                      </td>
                      <td className="px-6 py-3 text-center">{row.players.position}</td>
                      <td className="px-6 py-3">{row.players.teams?.name ?? "—"}</td>
                      <td className="px-6 py-3 text-center">{row.goals}</td>
                      <td className="px-6 py-3 text-center">{row.assists}</td>
                      <td className="px-6 py-3 text-center">{row.ga_ratio.toFixed(2)}</td>
                      <td className="px-6 py-3 text-center">{row.yellow_cards + row.red_cards}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>
      <p className="mt-8 text-center text-green-500 text-xs">
        Exclusivo Futstatics &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}
