"use client";

import { useState } from "react";
import {
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineEllipsis,
  AiOutlineSearch,
} from "react-icons/ai"; // Ícone de Ações
import Table from "../components/table";
import UpsertTeamsForm from "./components/upsert-teams-form";
import TeamBottomSlideOver from "../players/components/team-bottom-slide-over"; // Importando o Bottom Slide Over

interface Team {
  id: string;
  name: string;
  coach: string;
  players: number;
  value: string;
  founded: number;
}

const Teams = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Termo de pesquisa
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const allTeams: Team[] = [
    {
      id: "1",
      name: "FutStat FC",
      coach: "Carlos Silva",
      players: 22,
      value: "€150M",
      founded: 2001,
    },
    {
      id: "2",
      name: "Estrelas do Norte",
      coach: "Mariana Rocha",
      players: 20,
      value: "€120M",
      founded: 1998,
    },
    {
      id: "3",
      name: "Guerreiros FC",
      coach: "João Pereira",
      players: 18,
      value: "€95M",
      founded: 2005,
    },
  ];

  // Filtragem de times com base no termo de pesquisa
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filtra os times
  const filteredTeams = allTeams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);
  const paginatedTeams = filteredTeams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="space-y-4 text-center">
        <h2 className="text-5xl font-black text-white">Times</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Aqui você pode{" "}
          <span className="text-white font-semibold">adicionar times</span> e{" "}
          <span className="text-white font-semibold">
            gerenciar detalhes dos clubes
          </span>
          !
        </p>
      </div>

      {/* Campo de Pesquisa */}
      <div className="mb-6 flex justify-between items-center mt-12">
        <div className="relative w-full sm:w-96">
          <AiOutlineSearch
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Pesquisar Times"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-8 py-2 pl-12 rounded-xl bg-gray-800 text-white border-2 border-gray-700 focus:border-green-500 focus:outline-none placeholder-gray-500 shadow-md shadow-black/50 transition-all duration-300"
            style={{
              height: "40px",
            }}
          />
        </div>

        {/* Botão para abrir o modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-12 h-12 flex items-center justify-center rounded-full border-2 font-semibold hover:bg-green-800 hover:text-white animate-fade-in transition-all duration-300"
          style={{
            borderColor: "var(--highlight-green)",
            color: "var(--highlight-green)",
          }}
          aria-label="Adicionar Time"
        >
          <AiOutlinePlus size={24} />
        </button>
      </div>

      {/* Tabela */}
      <div className="mt-10">
        <Table>
          <thead className="bg-gray-900 text-gray-400 uppercase text-sm">
            <tr>
              {["Time", "Técnico", "Jogadores", "Valor", "Fundação", "Ações"].map(
                (header) => (
                  <th key={header} className="px-6 py-3 text-left">
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-gray-950 divide-y divide-gray-800">
            {paginatedTeams.map((team) => (
              <tr
                key={team.id}
                onClick={() => setSelectedTeam(team)} // Mantivemos o clique no time
                className="hover:bg-gray-900 transition duration-150 cursor-pointer"
              >
                <td
                  className="px-6 py-3 font-bold text-green-500"
                  style={{ width: "25%" }}
                >
                  {team.name}
                </td>
                <td className="px-6 py-3" style={{ width: "20%" }}>
                  {team.coach}
                </td>
                <td className="px-6 py-3" style={{ width: "15%" }}>
                  {team.players}
                </td>
                <td className="px-6 py-3" style={{ width: "20%" }}>
                  {team.value}
                </td>
                <td className="px-6 py-3" style={{ width: "20%" }}>
                  {team.founded}
                </td>
                <td className="px-6 py-3 w-24 text-center">
                  <button
                    onClick={() => setSelectedTeam(team)} // Ação de abrir o detalhe do time
                    className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-green-500 text-green-500 hover:bg-green-800 hover:text-white transition-all duration-300"
                    aria-label="Ações"
                  >
                    <AiOutlineEllipsis size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal de adicionar time */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-10 rounded-3xl shadow-xl shadow-black/30 w-[90%] sm:w-[600px] transition-all duration-300 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 text-center">
                <h3
                  className="text-3xl font-extrabold tracking-tight drop-shadow"
                  style={{ color: "var(--highlight-green)" }}
                >
                  Adicionar Time
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-green-500 text-green-500 font-semibold hover:bg-green-800 hover:text-white transition-all duration-300 active:scale-95"
                aria-label="Fechar Modal"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>
            <UpsertTeamsForm onSubmitSuccess={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Bottom Slide Over de detalhes do time */}
      {selectedTeam && (
        <TeamBottomSlideOver
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  );
};

export default Teams;
