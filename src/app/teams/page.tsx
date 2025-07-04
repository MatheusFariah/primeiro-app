// src/app/teams/TeamsPage.tsx
"use client";

import { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { FiBarChart2, FiEdit } from "react-icons/fi";
import {
  MdRemove,
  MdCheck,
  MdAdd,
} from "react-icons/md";
import { ArrowUpDown, ArrowRight, ArrowLeft } from "lucide-react";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import Drawer from "@mui/material/Drawer";
import { supabase } from "@/app/lib/supabaseClient";
import Table from "../components/table";
import UpsertTeamsForm from "./components/upsert-teams-form";
import UpsertPlayersForm from "../players/components/upsert-players-form";
import UpsertPlayerStatsForm from "../players/components/upsert-players-stats";
import StatsGraphs, { positionProfiles } from "./components/stats-graphs";
import EditPlayersForm from "./components/edit-players-form";

interface Team {
  id: number;
  name: string;
  coach: string;
  players: number;
  value: number;
  founded: number;
  league_name?: string; // <-- Adicione este campo
}


interface Player {
  id: number;
  name: string;
  age: number;
  dob: string;
  position: string;
  nationality: string;
  teams_id: number;
  status: string;
  weight: number;
  height: number;
  join_date: string;
  value: number;
}

// Repetimos aqui a interface de PlayerStats para podermos tipar o existingStats
interface PlayerStats {
  id?: number;
  players_id: number;
  goals: number;
  assists: number;
  matches_played: number;
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

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  // ACEITAMOS AGORA 5 VIEWS: list | stats | add | edit | upsertStats
  const [drawerView, setDrawerView] = useState<
    "list" | "stats" | "add" | "edit" | "upsertStats"
  >("list");

  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [existingStats, setExistingStats] = useState<PlayerStats | null>(null);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null
  );

  const [sortByPlayers, setSortByPlayers] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [playersValueMap, setPlayersValueMap] = useState<Record<string, number>>(
    {}
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Ícone de status que você já tinha
  function StatusIcon({ status }: { status: string }) {
    const baseClass =
      "w-6 h-6 flex items-center justify-center rounded-full text-white";

    switch (status.toLowerCase()) {
      case "ativo":
        return (
          <div className={`${baseClass} bg-green-600`} title="Ativo" aria-label="Ativo">
            <MdCheck className="w-4 h-4" />
          </div>
        );
      case "lesionado":
        return (
          <div className={`${baseClass} bg-red-600`} title="Lesionado" aria-label="Lesionado">
            <MdAdd size={20} />
          </div>
        );
      case "nulo":
      default:
        return (
          <div
            className={`${baseClass} bg-gray-600`}
            title="Nulo"
            aria-label="Nulo"
          >
            <MdRemove className="w-4 h-4" />
          </div>
        );
    }
  }

  const fetchTeams = async () => {
    const { data: teamsData, error: teamsError } = await supabase
      .from("teams")
      .select("*");

    const { data: leaguesData, error: leaguesError } = await supabase
      .from("leagues")
      .select("id, name");

    const { data: playersData, error: playersError } = await supabase
      .from("players")
      .select("teams_id, value");

    if (teamsError) {
      console.error("Erro ao buscar times:", teamsError);
      return;
    }
    if (leaguesError) {
      console.error("Erro ao buscar ligas:", leaguesError);
      return;
    }
    if (playersError) {
      console.error("Erro ao buscar jogadores:", playersError);
      return;
    }

    // Mapeia id da liga para nome
    const leagueMap = Object.fromEntries(
      (leaguesData || []).map((l: any) => [l.id, l.name])
    );

    const playersCountMap: Record<string, number> = {};
    const playersValueMapTemp: Record<string, number> = {};

    (playersData || []).forEach((pl: any) => {
      const teamId = String(pl.teams_id);
      playersCountMap[teamId] = (playersCountMap[teamId] || 0) + 1;
      playersValueMapTemp[teamId] = (playersValueMapTemp[teamId] || 0) + pl.value;
    });

    // Mapeia os times incluindo o nome da liga
    const mapped = (teamsData || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      coach: t.coach,
      value: t.value,
      founded: t.founded,
      players: playersCountMap[String(t.id)] || 0,
      league_name: t.leagues_id ? leagueMap[t.leagues_id] || "" : "", // <<<<<<
    }));

    setTeams(mapped);
    setPlayersValueMap(playersValueMapTemp);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchPlayersByTeamId = async (teamId: number) => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("teams_id", teamId);

    if (error) throw error;
    setPlayers(data as Player[]);
  };

  // Ajustamos fetchPlayerStatsById para também colocar existingStats
  const fetchPlayerStatsById = async (playerId: number) => {
    const { data, error } = await supabase
      .from("player_statics")
      .select("*")
      .eq("players_id", playerId)
      .single();

    if (error || !data) {
      setPlayerStats(null);
      setExistingStats(null);
      return null;
    } else {
      setPlayerStats(data as PlayerStats);
      setExistingStats(data as PlayerStats);
      return data as PlayerStats;
    }
  };

  useEffect(() => {
    // sempre que o selectedPlayer mudar, limpamos as estatísticas carregadas
    if (!selectedPlayer) {
      setPlayerStats(null);
      setExistingStats(null);
    }
  }, [selectedPlayer]);

  const handleSaveTeam = async (data: {
    name: string;
    coach: string;
    founded: number;
  }) => {
    let error;
    if (selectedTeam) {
      ({ error } = await supabase
        .from("teams")
        .update(data)
        .eq("id", selectedTeam.id));
    } else {
      ({ error } = await supabase.from("teams").insert(data));
    }

    if (error) {
      setStatusMessage(error.message);
      setStatusType("error");
    } else {
      setStatusMessage(
        selectedTeam
          ? "Time atualizado com sucesso!"
          : "Time criado com sucesso!"
      );
      setStatusType("success");
      fetchTeams();
      setIsModalOpen(false);
      setSelectedTeam(null);
    }

    setTimeout(() => {
      setStatusMessage(null);
      setStatusType(null);
    }, 3000);
  };

  const handleRowClick = async (team: Team) => {
    setSelectedTeam(team);
    await fetchPlayersByTeamId(team.id);
    setOpenDrawer(true);
    setDrawerView("list");
  };

  const formatBRL = (n: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(n);

  const toggleSortByPlayers = () => {
    setSortByPlayers(!sortByPlayers);
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const filtered = teams
    .filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortByPlayers) {
        return sortDirection === "asc"
          ? a.players - b.players
          : b.players - a.players;
      }
      return a.id - b.id;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedTeams = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 overflow-hidden">
      {statusMessage && (
        <div
          className={`mb-6 text-center px-6 py-3 rounded-2xl shadow-lg font-bold text-lg animate-slide-up transition-all duration-500 ${statusType === "success"
            ? "bg-highlight-green text-white"
            : "bg-red-600 text-white"
            }`}
        >
          {statusMessage}
        </div>
      )}

      <div className="space-y-4 text-center">
        <h2 className="text-5xl font-white text-highlight-green">Times</h2>
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

      <div className="mt-8 mb-4 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar times…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 py-2 w-64 rounded-full bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:ring-2 focus:outline-none"
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
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-highlight-green hover:text-white"
              aria-label="Limpar busca"
            >
              <AiOutlineClose size={18} />
            </button>
          )}
        </div>

        <button
          onClick={() => {
            setSelectedTeam(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-full bg-highlight-green/10 hover:bg-highlight-green/20 text-highlight-green px-4 py-2 transition-colors border border-highlight-green"
        >
          <AiOutlinePlus className="w-5 h-5" />
          <span className="font-semibold">Adicionar Time</span>
        </button>
      </div>

      <Table>
        <thead className="bg-gray-900 uppercase text-sm text-gray-400 shadow-md shadow-black/10 border-b border-gray-700">
          <tr>
            <th className="px-6 py-3 text-left">Time</th>
            <th className="px-6 py-3 text-left">Técnico</th>
            <th
              onClick={toggleSortByPlayers}
              className="px-6 py-3 text-left cursor-pointer hover:text-white transition-transform hover:scale-110"
            >
              <div className="flex items-center gap-2">
                Jogadores
                <ArrowUpDown
                  className={`w-4 h-4 transition-transform ${sortByPlayers && sortDirection === "desc"
                    ? "rotate-180"
                    : "rotate-0"
                    } ${sortByPlayers ? "opacity-100" : "opacity-30"}`}
                />
              </div>
            </th>
            <th className="px-6 py-3 text-left">Valor</th>
            <th className="px-6 py-3 text-left">Fundação</th>
            <th className="px-6 py-3 text-left">Liga</th>
            <th className="px-6 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-gray-950 divide-y divide-gray-800 text-gray-300">
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-400">
                Nenhum time encontrado.
              </td>
            </tr>
          ) : (
            paginatedTeams.map((team) => (
              <tr
                key={team.id}
                onClick={() => handleRowClick(team)}
                className="hover:bg-gray-800 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <td className="px-6 py-3 font-bold text-highlight-green">
                  {team.name}
                </td>
                <td className="px-6 py-3">{team.coach}</td>
                <td className="px-6 py-3">
                  {team.players === 0 ? "" : team.players}
                </td>
                <td className="px-6 py-3">
                  {formatBRL(playersValueMap[String(team.id)] || 0)}
                </td>
                <td className="px-6 py-3">{team.founded}</td>
                <td className="px-6 py-3">
                  {team.league_name ? (
                    team.league_name
                  ) : (
                    <span className="italic text-gray-500">—</span>
                  )}
                </td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTeam(team);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-full bg-highlight-green/10 hover:bg-highlight-green/20 text-highlight-green transition"
                    title="Editar time"
                  >
                    <FiEdit size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>


      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className={`w-8 h-8 flex items-center justify-center text-highlight-green hover:text-white hover:bg-highlight-green transition-colors ${currentPage === 1 ? "text-gray-500 cursor-not-allowed" : ""
              }`}
            aria-label="Primeira página"
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-8 h-8 flex items-center justify-center text-highlight-green hover:text-black hover:bg-highlight-green transition-colors ${currentPage === 1 ? "text-gray-500 cursor-not-allowed" : ""
              }`}
            aria-label="Página anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green">
            {currentPage}
          </div>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center text-highlight-green hover:text-white hover:bg-highlight-green transition-colors ${currentPage === totalPages
              ? "text-gray-500 cursor-not-allowed"
              : ""
              }`}
            aria-label="Próxima página"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center text-highlight-green hover:text-white hover:bg-highlight-green transition-colors ${currentPage === totalPages
              ? "text-gray-500 cursor-not-allowed"
              : ""
              }`}
            aria-label="Última página"
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      )}

      {/* Modal de adicionar/editar time */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative z-10 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-10 rounded-3xl shadow-xl w-[90%] sm:w-[600px] border border-white/10 animate-slide-up">
              <div className="relative mb-6">
                <h3 className="text-3xl font-extrabold text-center text-highlight-green">
                  {selectedTeam ? "Editar Time" : "Adicionar Time"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-0 top-0 w-12 h-12 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-white transition"
                  aria-label="Fechar Modal"
                >
                  <AiOutlineClose size={24} />
                </button>
              </div>
              <UpsertTeamsForm
                initialData={selectedTeam || undefined}
                onSubmit={handleSaveTeam}
              />
            </div>
          </div>
        </>
      )}

      {/* DRAWER (listas, forms, estatísticas, etc) */}
      <Drawer
        anchor="bottom"
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
          setDrawerView("list");
          setSelectedPlayer(null);
          setPlayerStats(null);
          setExistingStats(null);
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#111827",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 0,
            transition: "height 0.4s ease-in-out",
            height: 500,
            overflow: "hidden",
          },
        }}
      >
        <div className="w-full h-full overflow-y-auto scrollbar-hidden">
          <div
            className={`flex w-[500%] h-full transition-transform duration-500 ease-in-out`}
            style={{
              transform:
                drawerView === "add"
                  ? "translateX(0%)"
                  : drawerView === "list"
                    ? "translateX(-20%)"
                    : drawerView === "stats"
                      ? "translateX(-40%)"
                      : drawerView === "upsertStats"
                        ? "translateX(-60%)"
                        : "translateX(-80%)", // "edit"
            }}
          >
            {/* ============================
                   1) CADASTRAR JOGADOR
               ============================ */}
            <div className="w-1/5 h-full px-6 py-6 overflow-y-auto scrollbar-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-highlight-green">
                  Cadastrar Jogador
                </h3>
                <button
                  onClick={() => setDrawerView("list")}
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-white transition"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <UpsertPlayersForm
                teamId={selectedTeam?.id!}
                onSubmitSuccess={() => {
                  fetchPlayersByTeamId(selectedTeam?.id!);
                  setDrawerView("list");
                }}
                existingPlayer={null}
              />
            </div>

            {/* ============================
                   2) LISTAR JOGADORES
               ============================ */}
            <div className="w-1/5 h-full px-6 py-6 overflow-y-auto scrollbar-hidden bg-gray-900/70 backdrop-blur-md rounded-tr-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-highlight-green">
                  Jogadores de {selectedTeam?.name}
                </h3>
                <button
                  onClick={() => {
                    setSelectedPlayer(null);
                    setDrawerView("add");
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-white transition"
                >
                  <AiOutlinePlus size={20} />
                </button>
              </div>
              <div className="rounded-lg border border-gray-700">
                <Table>
                  <thead className="bg-gray-900 uppercase text-sm text-gray-400 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left">País</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Nome</th>
                      <th className="px-6 py-3 text-left">Posição</th>
                      <th className="px-6 py-3 text-left">Idade</th>
                      <th className="px-6 py-3 text-left">Contratado</th>
                      <th className="px-6 py-3 text-left">Preço (R$)</th>
                      <th className="px-6 py-3 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-950 divide-y divide-gray-800 text-white">
                    {players.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-6 italic">
                          Nenhum jogador encontrado.
                        </td>
                      </tr>
                    ) : (
                      players.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-gray-900 cursor-pointer"
                          onClick={async () => {
                            // clicando na row, abrimos a VIEW dos gráficos
                            setSelectedPlayer(p);
                            await fetchPlayerStatsById(p.id);
                            setDrawerView("stats");
                          }}
                        >
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={`https://flagcdn.com/w40/${p.nationality.toLowerCase()}.png`}
                                alt={p.nationality}
                                className="w-6 h-4 rounded-sm border border-white/10"
                              />
                              <span>{p.nationality}</span>
                            </div>
                          </td>

                          <td className="px-6 py-3 flex justify-center">
                            <StatusIcon status={p.status} />
                          </td>

                          <td className="px-6 py-3 font-semibold text-highlight-green capitalize">
                            {p.name}
                          </td>

                          <td className="px-6 py-3 capitalize">{p.position}</td>

                          <td className="px-6 py-3 text-center">{p.age}</td>

                          <td className="px-6 py-3 text-center">
                            {new Date(p.join_date).toLocaleDateString("pt-BR")}
                          </td>

                          <td className="px-6 py-3 text-right">
                            R$ {(p.value != null ? Number(p.value) : 0).toLocaleString("pt-BR")}
                          </td>


                          <td className="px-6 py-3 flex gap-2 justify-center">
                            {/* EDITAR JOGADOR */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlayer(p);
                                setDrawerView("edit");
                              }}
                              className="p-2 rounded-md bg-highlight-green/20 text-highlight-green hover:bg-highlight-green hover:text-white transition"
                              title="Editar Jogador"
                            >
                              <FiEdit size={18} />
                            </button>

                            {/* UPSET ESTATÍSTICAS */}
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                setSelectedPlayer(p);
                                // Carrega existingStats (ou null)
                                await fetchPlayerStatsById(p.id);
                                // Abre drawer no modo criar/editar estatísticas
                                setDrawerView("upsertStats");
                              }}
                              className="p-2 border-2 border-highlight-green rounded-md text-highlight-green hover:bg-highlight-green hover:text-white transition"
                              title="Cadastrar / Editar Estatísticas"
                            >
                              <FiBarChart2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </div>

            {/* ============================
                   3) VISUALIZAR GRÁFICOS
               ============================ */}
            <div className="w-1/5 h-full px-6 py-6 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-highlight-green">
                  Estatísticas de {selectedPlayer?.name ?? "Jogador"}
                </h3>
                <button
                  onClick={() => setDrawerView("list")}
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-black transition"
                  title="Voltar"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              {playerStats ? (
                <StatsGraphs
                  stats={playerStats}
                  position={
                    selectedPlayer?.position &&
                      positionProfiles[selectedPlayer.position]
                      ? selectedPlayer.position
                      : "ATA"
                  }
                />
              ) : (
                <p className="text-center text-sm text-gray-500 italic">
                  Nenhuma estatística encontrada.
                </p>
              )}
            </div>

            {/* ============================
                   4) UPSERT ESTATÍSTICAS
               ============================ */}
            <div className="w-1/5 h-full px-6 py-6 overflow-y-auto scrollbar-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-highlight-green">
                  {existingStats ? "Editar Estatísticas" : "Cadastrar Estatísticas"}
                </h3>
                <button
                  onClick={() => setDrawerView("list")}
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-black transition"
                  title="Voltar"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

              {selectedPlayer && (
                <UpsertPlayerStatsForm
                  playerId={selectedPlayer.id}
                  existingStats={existingStats}
                  position={selectedPlayer.position}
                  onSubmitSuccess={() => {
                    // após criar/editar a estatística:
                    fetchPlayerStatsById(selectedPlayer.id);
                    setDrawerView("stats");
                  }}
                />
              )}
            </div>

            {/* ============================
                   5) EDITAR JOGADOR
               ============================ */}
            <div className="w-1/5 h-full px-6 py-6 overflow-y-auto scrollbar-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-highlight-green">
                  Editar Jogador
                </h3>
                <button
                  onClick={() => setDrawerView("list")}
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-black transition"
                  title="Voltar"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              {selectedPlayer && (
                <EditPlayersForm
                  teamId={selectedTeam!.id}
                  existingPlayer={selectedPlayer}
                  onSubmitSuccess={() => {
                    fetchPlayersByTeamId(selectedTeam!.id);
                    setSelectedPlayer(null);
                    setDrawerView("list");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
