"use client";

import { useState } from "react";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import Table from "../components/table";
import UpsertLeaguesForm from "./components/upsert-leagues-form";

const leagues = [
  {
    id: 1,
    name: "Brasileirão Série A",
    matches: 38,
    teamsCount: 20,
  },
  {
    id: 2,
    name: "Premier League",
    matches: 38,
    teamsCount: 20,
  },
  {
    id: 3,
    name: "La Liga",
    matches: 38,
    teamsCount: 20,
  },
  // Mais ligas aqui...
];

const Leagues = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  <>
    <thead className="bg-gray-900 uppercase text-sm text-gray-400">
      <tr>
        <th className="px-6 py-3 text-left">Liga</th>
        <th className="px-6 py-3 text-left">Times</th>
        <th className="px-6 py-3 text-left">Partidas</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-800 bg-gray-950">
      {leagues.map((league) => (
        <tr
          key={league.id}
          className="hover:bg-gray-900 transition duration-150 ease-in-out"
        >
          <td className="px-6 py-3 font-bold text-green-500">{league.name}</td>
          <td className="px-6 py-3">{league.teamsCount}</td>
          <td className="px-6 py-3">{league.matches}</td>
        </tr>
      ))}
    </tbody>
  </>
</Table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          {/* Conteúdo do Modal */}
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
            <UpsertLeaguesForm onSubmitSuccess={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Leagues;
