"use client";
import StatsGraphs from "./components/stats-graphs";
import { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import Drawer from "@mui/material/Drawer";
import Table from "../components/table";
import UpsertTeamsForm from "./components/upsert-teams-form";
import { supabase } from "@/app/lib/supabaseClient";
import { ArrowLeft } from "lucide-react";

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

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null
  );
  const [players, setPlayers] = useState<Player[]>([]);
  const [drawerView, setDrawerView] = useState<"list" | "stats">("list");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerStats, setPlayerStats] = useState<any | null>(null);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from("teams").select("*");
      if (error) throw error;
      setTeams(data as Team[]);
    } catch (err) {
      setError("Erro ao carregar os times.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayersByTeamId = async (teamId: number) => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("teams_id", teamId);

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

  const handleSaveTeam = async (data: {
    name: string;
    coach: string;
    value: number;
    founded: number;
  }) => {
    try {
      let error;
      if (selectedTeam) {
        ({ error } = await supabase
          .from("teams")
          .update(data)
          .eq("id", selectedTeam.id));
      } else {
        ({ error } = await supabase.from("teams").insert(data));
      }

      if (error) throw error;

      setStatusMessage(
        selectedTeam
          ? "Time atualizado com sucesso!"
          : "Time cadastrado com sucesso!"
      );
      setStatusType("success");
      setIsModalOpen(false);
      setSelectedTeam(null);
      fetchTeams();
    } catch (err: any) {
      setStatusMessage(err.message || "Erro ao salvar time.");
      setStatusType("error");
    } finally {
      setTimeout(() => {
        setStatusMessage(null);
        setStatusType(null);
      }, 3000);
    }
  };

  const handleRowClick = async (team: Team) => {
    setSelectedTeam(team);
    await fetchPlayersByTeamId(team.id);
    setOpenDrawer(true);
  };

  const filtered = teams
    .filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.id - b.id);

  const formatBRL = (n: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(n);
  const fetchPlayerStatsById = async (playerId: number) => {
    const { data, error } = await supabase
      .from("player_statics")
      .select("*")
      .eq("players_id", playerId)
      .single();

    if (error) {
      console.error("Erro ao buscar estatísticas:", error.message);
      setPlayerStats(null);
    } else {
      setPlayerStats(data);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {statusMessage && (
        <div
          className={`mb-6 text-center px-6 py-3 rounded-2xl shadow-lg font-bold text-lg animate-slide-up transition-all duration-500
          ${
            statusType === "success"
              ? "bg-highlight-green text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {statusMessage}
        </div>
      )}

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

      <div className="flex items-center justify-between mt-8 mb-4">
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

        <button
          onClick={() => {
            setSelectedTeam(null);
            setIsModalOpen(true);
          }}
          className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-black transition-colors"
          aria-label="Adicionar Time"
        >
          <AiOutlinePlus size={20} />
        </button>
      </div>

      <div className="mt-4">
        <Table>
          <thead className="bg-gray-900 uppercase text-sm text-gray-400">
            <tr>
              <th className="px-6 py-3 text-left">Time</th>
              <th className="px-6 py-3 text-left">Técnico</th>
              <th className="px-6 py-3 text-left">Jogadores</th>
              <th className="px-6 py-3 text-left">Valor</th>
              <th className="px-6 py-3 text-left">Fundação</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-gray-950 divide-y divide-gray-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-10 rounded-3xl shadow-xl shadow-black/30 w-[90%] sm:w-[600px] transition-all duration-300 border border-white/10 animate-slide-up">
            <div className="relative mb-6">
              <h3 className="text-3xl font-extrabold text-center text-highlight-green">
                {selectedTeam ? "Editar Time" : "Adicionar Time"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-0 top-0 w-12 h-12 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-black transition-colors"
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
      )}

      <Drawer
        anchor="bottom"
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
          setDrawerView("list");
          setSelectedPlayer(null);
          setPlayerStats(null);
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
        <div className="w-full h-full overflow-hidden">
          <div
            className={`flex w-[200%] h-full transition-transform duration-500 ease-in-out`}
            style={{
              transform:
                drawerView === "list" ? "translateX(0%)" : "translateX(-50%)",
            }}
          >
            {/* LISTA DE JOGADORES */}
            <div className="w-1/2 h-full overflow-y-auto px-4 pb-6">
              <h3 className="text-2xl font-bold text-highlight-green text-center my-4">
                Jogadores de {selectedTeam?.name}
              </h3>

              <Table>
                <thead className="text-gray-400 text-sm uppercase">
                  <tr>
                    <th className="px-4 py-2 text-left">País</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Nome</th>
                    <th className="px-4 py-2 text-left">Posição</th>
                    <th className="px-4 py-2 text-left">Idade</th>
                    <th className="px-4 py-2 text-left">Contratado</th>
                    <th className="px-4 py-2 text-left">Preço (R$)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300 divide-y divide-gray-700">
                  {players.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-6 italic text-gray-500"
                      >
                        Nenhum jogador encontrado.
                      </td>
                    </tr>
                  ) : (
                    players.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-gray-800/40 transition cursor-pointer"
                        onClick={async () => {
                          setSelectedPlayer(p);
                          await fetchPlayerStatsById(p.id);
                          setDrawerView("stats");
                        }}
                      >
                        <td className="px-4 py-2 capitalize">
                          {p.nationality}
                        </td>
                        <td className="px-4 py-2 capitalize">{p.status}</td>
                        <td className="px-4 py-2 capitalize">{p.name}</td>
                        <td className="px-4 py-2 capitalize">{p.position}</td>
                        <td className="px-4 py-2">{p.age}</td>
                        <td className="px-4 py-2">
                          {new Date(p.join_date).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-highlight-green">R$</span>{" "}
                          {new Intl.NumberFormat("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(p.value)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>

            {/* ESTATÍSTICAS DO JOGADOR */}
            <div className="w-1/2 h-full overflow-y-auto px-6 py-6 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-highlight-green">
                  Estatísticas de {selectedPlayer?.name}
                </h3>
                  
                <button
                  onClick={() => {
                    setDrawerView("list");
                    setSelectedPlayer(null);
                    setPlayerStats(null);
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-black transition-colors"
                  aria-label="Voltar"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

              {playerStats ? (
                <StatsGraphs stats={playerStats} />
              ) : (
                <p className="text-center text-sm text-gray-500 italic">
                  Nenhuma estatística encontrada para este jogador.
                </p>
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
