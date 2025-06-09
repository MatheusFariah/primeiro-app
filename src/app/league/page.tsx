"use client";

import { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import Table from "../components/table";
import { supabase } from "@/app/lib/supabaseClient";
import UpsertLeaguesForm, { League } from "./components/upsert-leagues-form";
import EditLeaguesForm from "./components/edit-leagues-form";

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeague, setEditingLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(false);

  // Buscar as ligas e os times separadamente (join manual)
  const fetchLeagues = async () => {
    setLoading(true);

    const { data: leaguesData, error: leaguesError } = await supabase
      .from("leagues")
      .select("*");

    const { data: teamsData, error: teamsError } = await supabase
      .from("teams")
      .select("id, leagues_id");

    if (leaguesError || teamsError) {
      setLeagues([]);
      setLoading(false);
      return;
    }

    setLeagues(
      (leaguesData || []).map((l: any) => ({
        ...l,
        teamsCount: (teamsData || []).filter((t: any) => t.leagues_id === l.id).length,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="space-y-4 text-center">
        <h2 className="text-5xl font-black text-white">Ligas</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Aqui você pode{" "}
          <span className="text-white font-semibold">ver as principais ligas</span> e{" "}
          <span className="text-white font-semibold">acompanhar seus dados gerais</span>!
        </p>
      </div>

      {/* Botão para abrir o modal */}
      <div className="flex justify-end items-center p-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="
            w-12 h-12 
            flex items-center justify-center 
            rounded-full border-2 
            font-semibold 
            hover:bg-green-800 hover:text-white
            animate-fade-in transition-all duration-300
          "
          style={{
            borderColor: "var(--highlight-green)",
            color: "var(--highlight-green)",
          }}
          aria-label="Adicionar Liga"
        >
          <AiOutlinePlus size={24} />
        </button>
      </div>

      {/* Tabela */}
      <div className="mt-10">
        <Table>
          <thead className="bg-gray-900 uppercase text-sm text-gray-400">
            <tr>
              <th className="px-6 py-3 text-left">Liga</th>
              <th className="px-6 py-3 text-left">Times</th>
              <th className="px-6 py-3 text-left">Localização</th>
              <th className="px-6 py-3 text-left">Início</th>
              <th className="px-6 py-3 text-left">Fim</th>
              <th className="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-950">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  Carregando...
                </td>
              </tr>
            ) : leagues.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  Nenhuma liga encontrada.
                </td>
              </tr>
            ) : (
              leagues.map((league) => (
                <tr
                  key={league.id}
                  className="hover:bg-gray-900 transition duration-150 ease-in-out"
                >
                  <td className="px-6 py-3 font-bold text-green-500">
                    {league.name}
                  </td>
                  <td className="px-6 py-3">{(league as any).teamsCount}</td>
                  <td className="px-6 py-3">{league.location || "-"}</td>
                  <td className="px-6 py-3">
                    {league.created_at
                      ? new Date(league.created_at).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>
                  <td className="px-6 py-3">
                    {league.ended_at
                      ? new Date(league.ended_at).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>
                  <td className="px-6 py-3 flex gap-2">
                    <button
                      onClick={() => setEditingLeague(league)}
                      className="p-2 rounded-md bg-highlight-green/20 text-highlight-green hover:bg-highlight-green hover:text-white transition"
                      title="Editar Liga"
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

      {/* Modal de criar liga */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          <div
            className="
              relative z-10 
              bg-gradient-to-br from-gray-800/80 to-gray-900/80 
              p-10 rounded-3xl shadow-xl shadow-black/30 
              w-[90%] sm:w-[600px] 
              transition-all duration-300 border border-white/10
            "
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 text-center">
                <h3
                  className="text-3xl font-extrabold tracking-tight drop-shadow"
                  style={{ color: "var(--highlight-green)" }}
                >
                  Adicionar Liga
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="
                  w-12 h-12 
                  flex items-center justify-center 
                  rounded-full border-2 border-green-500 
                  text-green-500 font-semibold 
                  hover:bg-green-800 hover:text-white
                  transition-all duration-300 
                  active:scale-95
                "
                aria-label="Fechar Modal"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>
            <UpsertLeaguesForm
              onSubmitSuccess={() => {
                setIsModalOpen(false);
                fetchLeagues();
              }}
            />
          </div>
        </div>
      )}

      {/* Modal de editar liga */}
      {editingLeague && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditingLeague(null)}
          />
          <div className="relative z-10 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-10 rounded-3xl shadow-xl w-[90%] sm:w-[600px] border border-white/10 animate-slide-up">
            <div className="relative mb-6">
              <h3 className="text-3xl font-extrabold text-center text-highlight-green">
                Editar Liga
              </h3>
              <button
                onClick={() => setEditingLeague(null)}
                className="absolute right-0 top-0 w-12 h-12 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-white transition"
                aria-label="Fechar Modal"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>
            <EditLeaguesForm
              existingLeague={editingLeague}
              onSubmitSuccess={() => {
                setEditingLeague(null);
                fetchLeagues();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
