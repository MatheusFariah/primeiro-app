// src/app/teams/page.tsx
"use client";

import { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import Table from "../components/table";
import UpsertTeamsForm from "./components/upsert-teams-form";

interface Team {
  id: number;
  name: string;
  coach: string;
  players: number;
  value: number;
  founded: number;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/teams");
      const data = await res.json();
      if (Array.isArray(data)) setTeams(data);
      else setError("Dados inválidos recebidos.");
    } catch {
      setError("Erro ao carregar os times.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filtered = teams.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatBRL = (n: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(n);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Cabeçalho centralizado */}
      <div className="space-y-4 text-center">
        <h2 className="text-5xl font-black text-white">Times</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Aqui você pode{" "}
          <span className="text-white font-semibold">ver seus times</span> e{" "}
          <span className="text-white font-semibold">gerenciar seus dados</span>!
        </p>
      </div>

      {/* Linha de controles: pesquisa à esquerda, botão + à direita */}
      <div className="flex items-center justify-between mt-8 mb-4">
        {/* Pesquisa */}
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar times…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 rounded-full bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-[#00bb48]"
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

        {/* Botão + */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#00bb48] hover:bg-[#00bb48] hover:text-white transition-colors"
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
                  className="hover:bg-gray-900 transition-colors"
                >
                  <td className="px-6 py-3 font-bold text-[#00bb48]">
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-10 rounded-3xl shadow-xl shadow-black/30 w-[90%] sm:w-[600px] transition-all duration-300 border border-white/10">
            {/* Header do Modal com título centralizado e botão absoluto */}
            <div className="relative mb-6">
              <h3
                className="text-3xl font-extrabold text-center w-full drop-shadow"
                style={{ color: "#00bb48" }}
              >
                Adicionar Time
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-0 top-0 w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#00bb48] text-[#00bb48] font-semibold hover:bg-[#00bb48] hover:text-white transition-colors"
                aria-label="Fechar Modal"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>
            <UpsertTeamsForm
              onSubmitSuccess={() => {
                fetchTeams();
                setIsModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
