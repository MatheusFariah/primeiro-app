"use client";

import { useState } from "react";
import Table from "../components/table";
import UpsertTeamsForm from "./components/upsert-teams-form";

const Teams = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="space-y-4 text-center">
        <h2 className="text-5xl font-black text-white">Times</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Aqui você pode{" "}
          <span className="text-white font-semibold">adicionar times</span> e{" "}
          <span className="text-white font-semibold">
            acompanhar o desempenho coletivo
          </span>
          !
        </p>
      </div>

      {/* Botão para abrir o modal */}
      <div className="flex justify-end mt-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="
            bg-green-500 text-white font-bold 
            py-2 px-6 rounded-full 
            shadow-lg 
            transform transition-transform duration-200 
            hover:scale-105
          "
        >
          <span className="text-xl">+</span>
          <span>Adicionar Time</span>
        </button>
      </div>

      {/* Tabela */}
      <div className="mt-10">
        <Table>
          <thead className="bg-gray-900 text-gray-400 uppercase text-sm">
            <tr>
              {["Time", "Partidas", "Vitórias", "Empates", "Derrotas", "Pontos"].map((h) => (
                <th key={h} className="px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-950 divide-y divide-gray-800">
            {[
              { name: "FutStat FC", p: 10, w: 7, d: 2, l: 1, pts: 23 },
              { name: "Estrelas do Norte", p: 10, w: 5, d: 3, l: 2, pts: 18 },
              { name: "Guerreiros FC", p: 10, w: 3, d: 2, l: 5, pts: 11 },
            ].map((team) => (
              <tr key={team.name} className="hover:bg-gray-900 transition duration-150">
                <td className="px-6 py-3">{team.name}</td>
                <td className="px-6 py-3">{team.p}</td>
                <td className="px-6 py-3">{team.w}</td>
                <td className="px-6 py-3">{team.d}</td>
                <td className="px-6 py-3">{team.l}</td>
                <td className="px-6 py-3 font-bold text-green-500">{team.pts}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay semitransparente + blur */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Conteúdo do modal */}
          <div
            className="
              relative z-10 
              bg-gray-800 bg-opacity-80 
              p-10 rounded-2xl shadow-2xl 
              w-[90%] sm:w-[600px] 
              transition-all duration-300
            "
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-white">Adicionar Time</h3>
              {/* Botão de fechar circular */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="
                  w-10 h-10 
                  flex items-center justify-center 
                  bg-green-500 text-white 
                  rounded-full 
                  shadow-md
                  transform transition-transform duration-200 
                  hover:scale-105
                "
              >
                ✕
              </button>
            </div>

            {/* Formulário */}
            <UpsertTeamsForm onSubmitSuccess={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
