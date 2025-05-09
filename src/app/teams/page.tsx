"use client";
import StatsGraphs from "./components/stats-graphs";
import { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import Drawer from "@mui/material/Drawer";
import Table from "../components/table";
import UpsertTeamsForm from "./components/upsert-teams-form";
import { supabase } from "@/app/lib/supabaseClient";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
  ArrowRight,
  Save,
} from "lucide-react";
import UpsertPlayersForm from "../players/components/upsert-players-form";

interface Team {
  id: number;
  name: string;
  coach: string;
  players: number;
  value: number;
  founded: number;
}
type RawTeam = {
  id: number;
  name: string;
  coach: string;
  value: number;
  founded: number;
  players: { id: number }[]; // 👈 recebe só os ids dos jogadores
};
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
  const [drawerView, setDrawerView] = useState<"list" | "stats" | "add">(
    "list"
  );
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerStats, setPlayerStats] = useState<any | null>(null);
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = teams
    .filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.id - b.id);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedTeams = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const positionOrder = [
    "GOL",
    "LAT",
    "ZAG",
    "VOL",
    "MEI",
    "PE",
    "PD",
    "SA",
    "ATA",
  ];
  const paginationItems = [
    {
      key: "first",
      icon: <ChevronsLeft size={20} />,
      page: 1,
      disabled: currentPage === 1,
    },
    {
      key: "prev",
      icon: <ChevronLeft size={20} />,
      page: currentPage - 1,
      disabled: currentPage === 1,
    },
    ...Array.from({ length: totalPages }, (_, i) => ({
      key: `page-${i + 1}`,
      label: i + 1,
      page: i + 1,
      active: currentPage === i + 1,
    })),
    {
      key: "next",
      icon: <ChevronRight size={20} />,
      page: currentPage + 1,
      disabled: currentPage === totalPages,
    },
    {
      key: "last",
      icon: <ChevronsRight size={20} />,
      page: totalPages,
      disabled: currentPage === totalPages,
    },
  ];

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("teams")
        // id, name … + array de jogadores
        // ✓ certo: "players ( id )"
        .select("id, name, coach, value, founded, players ( id )");
      if (error) throw error;

      /* Converte RawTeam → Team, contando o tamanho do array */
      const mapped = (data as RawTeam[]).map((t) => ({
        id: t.id,
        name: t.name,
        coach: t.coach,
        value: t.value,
        founded: t.founded,
        players: t.players.length, // 🔢 contagem aqui
      }));

      setTeams(mapped);
    } catch (err) {
      setError("Erro ao carregar os times.");
    } finally {
      setLoading(false);
    }
  };

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
  const formatBRL = (n: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(n);
  const fetchPlayersByTeamId = async (teamId: number) => {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("teams_id", teamId)
        .order("name", { ascending: true });

      if (error) throw error;

      setPlayers(data as Player[]);
    } catch (error) {
      console.error("Erro ao buscar jogadores:", error);
      setPlayers([]);
    }
  };

  const handleRowClick = async (team: Team) => {
    setSelectedTeam(team);
    await fetchPlayersByTeamId(team.id);
    setOpenDrawer(true);
  };

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
  useEffect(() => {
    fetchTeams();
  }, []);
  // 1. Adicione esses dois useState acima do return
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const toggleSortByPosition = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
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

      <div className="mt-8 mb-4 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar times…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 py-2 w-64 rounded-full bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:ring-2 focus:outline-none"
          />

          {/* Ícone da lupa */}
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

          {/* Botão de limpar texto */}
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
      </div>

      <div className="mt-4">
        <Table>
          <thead className="bg-gray-900 uppercase text-sm text-gray-400 shadow-md shadow-black/10 border-b border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Time</th>
              <th className="px-6 py-3 text-left">Técnico</th>
              <th className="px-6 py-3 text-left">Jogadores</th>
              <th className="px-6 py-3 text-left">Valor</th>
              <th className="px-6 py-3 text-left">Fundação</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-gray-950 divide-y divide-gray-800 text-gray-300">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-[px] mt-10 flex-wrap">
          {/* Primeira página */}
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className={`w-8 h-8 flex items-center justify-center text-highlight-green hover:text-black hover:bg-highlight-green transition-colors ${
              currentPage === 1 ? "text-gray-500 cursor-not-allowed" : ""
            }`}
            aria-label="Primeira página"
          >
            <ChevronsLeft size={18} />
          </button>

          {/* Anterior */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-8 h-8 flex items-center justify-center text-highlight-green hover:text-black hover:bg-highlight-green transition-colors ${
              currentPage === 1 ? "text-gray-500 cursor-not-allowed " : ""
            }`}
            aria-label="Página anterior"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Página atual */}
          <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green ">
            {currentPage}
          </div>

          {/* Próxima */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center text-highlight-green hover:text-black hover:bg-highlight-green transition-colors ${
              currentPage === 1 ? "text-gray-500" : ""
            }`}
            aria-label="Próxima página"
          >
            <ChevronRight size={18} />
          </button>

          {/* Última */}
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center text-highlight-green hover:text-black hover:bg-highlight-green transition-colors ${
              currentPage === 1 ? "text-gray-500 " : ""
            }`}
            aria-label="Última página"
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      )}

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
            className={`flex w-[300%] h-full transition-transform duration-500 ease-in-out`}
            style={{
              transform:
                drawerView === "add"
                  ? "translateX(0%)"
                  : drawerView === "list"
                  ? "translateX(-33.3333%)"
                  : "translateX(-66.6666%)",
            }}
          >
            {/* TELA DE CADASTRO */}
            <div className="w-1/3 h-full overflow-hidden px-6 py-6 flex flex-col">
              {/* Header com botões */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-highlight-green">
                  Cadastrar Jogador
                </h3>
                <div className="flex items-end gap-2">
                  {/* Botão de voltar */}
                  <button
                    onClick={() => setDrawerView("list")}
                    className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-black transition-colors"
                    aria-label="Voltar"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Formulário */}
              <div className="flex-1 overflow-y-auto pr-2">
                <UpsertPlayersForm
                  teamId={selectedTeam?.id!}
                  onSubmitSuccess={() => {
                    fetchPlayersByTeamId(selectedTeam?.id!);
                    setDrawerView("list");
                  }}
                />
              </div>
            </div>

            {/* LISTA DE JOGADORES */}
            <div className="w-1/3 h-full overflow-y-scroll scrollbar-hidden px-6 py-6 bg-gray-900/70 backdrop-blur-md rounded-tr-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-highlight-green">
                  Jogadores de {selectedTeam?.name}
                </h3>
                <button
                  onClick={() => setDrawerView("add")}
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-black transition-colors"
                  aria-label="Adicionar Jogador"
                >
                  <AiOutlinePlus size={20} />
                </button>
              </div>

              <div className="rounded-lg overflow-hidden border border-gray-700">
                <Table>
                  <thead className="bg-gray-900 uppercase text-sm text-gray-400 shadow-md shadow-black/10 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left">País</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Nome</th>
                      <th
                        onClick={toggleSortByPosition}
                        className="px-6 py-3 text-left cursor-pointer hover:text-white"
                      >
                        Posição {sortDirection === "asc" ? "↑" : "↓"}
                      </th>
                      <th className="px-6 py-3 text-left">Idade</th>
                      <th className="px-6 py-3 text-left">Contratado</th>
                      <th className="px-6 py-3 text-left">Preço (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-950 divide-y divide-gray-800 text-gray-300">
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
                      [...players]
                        .sort((a, b) => {
                          const indexA = positionOrder.indexOf(
                            a.position.toUpperCase()
                          );
                          const indexB = positionOrder.indexOf(
                            b.position.toUpperCase()
                          );

                          const safeA = indexA === -1 ? 999 : indexA;
                          const safeB = indexB === -1 ? 999 : indexB;

                          return sortDirection === "asc"
                            ? safeA - safeB
                            : safeB - safeA;
                        })
                        .map((p) => (
                          <tr
                            key={p.id}
                            onClick={async () => {
                              setSelectedPlayer(p);
                              await fetchPlayerStatsById(p.id);
                              setDrawerView("stats");
                            }}
                            className="hover:bg-gray-900 transition-colors cursor-pointer"
                          >
                            <td className="px-6 py-3 capitalize">
                              {p.nationality}
                            </td>
                            <td className="px-6 py-3 capitalize">{p.status}</td>
                            <td className="px-6 py-3 font-semibold text-highlight-green capitalize">
                              {p.name}
                            </td>
                            <td className="px-6 py-3 capitalize">
                              {p.position}
                            </td>
                            <td className="px-6 py-3">{p.age}</td>
                            <td className="px-6 py-3">
                              {new Date(p.join_date).toLocaleDateString(
                                "pt-BR"
                              )}
                            </td>
                            <td className="px-6 py-3">
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
            </div>

            {/* ESTATÍSTICAS DO JOGADOR */}
            <div className="w-1/3 h-full overflow-y-auto px-6 py-6 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-highlight-green">
                  Estatísticas de {selectedPlayer?.name}
                </h3>
                <button
                  onClick={() => setDrawerView("list")}
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-black transition-colors shadow-md"
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
