"use client";

import { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import Table from "../components/table";
import UpsertTeamsForm from "./components/upsert-teams-form";
import Drawer from "@mui/material/Drawer";
import { supabase } from "@/app/lib/supabaseClient";

interface Team {
  id: number;
  name: string;
  coach: string;
  players: number;
  value: number;
  founded: number;
}

interface Player {
  id: number;
  name: string;
  age: number;
  dob: string; // data de nascimento
  position: string;
  nationality: string;
  teams_id: number;
  status: string;
  weight: number;
  height: number;
  join_date: string;
  value: number;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`);
      const data = await res.json();
      if (Array.isArray(data)) setTeams(data);
      else setError("Dados inválidos recebidos.");
    } catch {
      setError("Erro ao carregar os times.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayersByTeamId = async (teamId: number) => {
    const { data, error } = (await supabase
      .from("players")
      .select(
        `
        id, name, age, dob, position, nationality,
        teams_id, status, weight, height, join_date, value
      `
      )
      .eq("teams_id", teamId)) as { data: Player[] | null; error: any };

    if (error) {
      console.error("Erro ao carregar jogadores:", error.message);
      setPlayers([]);
    } else {
      setPlayers(data ?? []);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filtered = teams.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formatar valores em R$ - Seguro
  const formatBRL = (n: number | null | undefined) => {
    if (typeof n !== "number" || isNaN(n)) return "-";
    const getFlagEmoji = (countryCode: string) => {
      if (!countryCode) return "🏳️";
      return countryCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(127397 + char.charCodeAt(0))
        );
    };

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  };

  // Formatar datas - Seguro
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleRowClick = async (team: Team) => {
    setSelectedTeam(team);
    await fetchPlayersByTeamId(team.id);
    setOpenDrawer(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="space-y-4 text-center">
        <h2 className="text-5xl font-black text-highlight-green">Times</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Aqui você pode{" "}
          <span className="text-highlight-green font-semibold">
            ver seus times
          </span>{" "}
          e{" "}
          <span className="text-highlight-green font-semibold">
            gerenciar seus dados
          </span>
          !
        </p>
      </div>

      {/* Linha de controles */}
      <div className="flex items-center justify-between mt-8 mb-4">
        {/* Pesquisa */}
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar times…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 rounded-full bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:ring-2"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </div>

        {/* Botão de Adicionar */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover-bg-highlight-green hover-text-highlight-green transition-colors"
          aria-label="Adicionar Time"
        >
          <AiOutlinePlus size={20} />
        </button>
      </div>

      {/* Tabela */}
      <div className="mt-4">
        <Table>
          <thead className="bg-gray-900 uppercase text-sm text-gray-400">
            <tr>
              <th className="px-6 py-3 text-left">Time</th>
              <th className="px-6 py-3 text-left">Técnico</th>
              <th className="px-6 py-3 text-left">Jogadores</th>
              <th className="px-6 py-3 text-left">Valor</th>
              <th className="px-6 py-3 text-left">Fundação</th>
            </tr>
          </thead>
          <tbody className="bg-gray-950 divide-y divide-gray-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  Nenhum time encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((team) => (
                <tr
                  key={team.id}
                  onClick={() => handleRowClick(team)}
                  className="hover:bg-gray-900 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-3 font-bold text-highlight-green">
                    {team.name}
                  </td>
                  <td className="px-6 py-3">{team.coach}</td>
                  <td className="px-6 py-3">{team.players}</td>
                  <td className="px-6 py-3">{formatBRL(team.value)}</td>
                  <td className="px-6 py-3">{team.founded}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Drawer com jogadores reais */}
      <Drawer
        anchor="bottom"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#111827",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            height: 500, // altura fixa
            overflow: "hidden", // bloqueia scroll externo
          },
        }}
      >
        <div className="h-full flex flex-col">
          {/* Cabeçalho fixo */}
          <div className="px-6 pt-6 pb-4 text-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-highlight-green tracking-tight">
              Jogadores de {selectedTeam?.name}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Lista oficial dos jogadores vinculados ao time selecionado.
            </p>
          </div>

          {/* Conteúdo scrollável */}
          <div className="flex-1 px-6 pb-6 overflow-y-auto space-y-6">
            <div className="bg-gray-900/60 rounded-xl shadow-inner shadow-black/20 overflow-x-auto">
              <Table>
                <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Nome</th>
                    <th className="px-4 py-3 text-left">Posição</th>
                    <th className="px-4 py-3 text-left">País</th>
                    <th className="px-4 py-3 text-left">Idade</th>
                    <th className="px-4 py-3 text-left">Nascimento</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Valor</th>
                  </tr>
                </thead>

                <tbody className="text-gray-200 divide-y divide-gray-800 text-sm">
                  {players.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center px-6 py-6 text-gray-500 italic"
                      >
                        Nenhum jogador encontrado para este time.
                      </td>
                    </tr>
                  ) : (
                    players.map((player) => (
                      <tr
                        key={player.id}
                        className="hover:bg-gray-800/50 transition"
                      >
                        <td className="px-4 py-2">{player.name}</td>
                        <td className="px-4 py-2">{player.position}</td>
                        <td className="px-4 py-2">{player.nationality}</td>
                        <td className="px-4 py-2">{player.age}</td>
                        <td className="px-4 py-2">{formatDate(player.dob)}</td>
                        <td className="px-4 py-2">{player.status}</td>
                        <td className="px-4 py-2">{formatBRL(player.value)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
