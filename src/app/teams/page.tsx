"use client";

import { useState } from "react";
import Table from "../components/table";
import UpsertTeamsForm from "./components/upsert-teams-form";

const Teams = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Texto de boas-vindas */}
      <div className="space-y-4">
        <h2 className="text-5xl font-black tracking-tight leading-tight text-center">
          <span className="text-white">Times</span>
        </h2>
        <p className="text-lg text-gray-300 leading-relaxed max-w-2xl text-center mx-auto">
          Aqui você pode{" "}
          <span className="text-white font-semibold">adicionar times</span> e{" "}
          <span className="text-white font-semibold">
            acompanhar o desempenho coletivo
          </span>
          !
        </p>
      </div>

      {/* Botão para abrir o modal no lado direito, acima da tabela */}
      <div className="flex justify-end mt-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          + Adicionar Time
        </button>
      </div>

      {/* Tabela de Times utilizando o componente Table */}
      <div className="mt-10">
        <Table>
          <thead className="bg-gray-900 uppercase text-sm text-gray-400">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Partidas</th>
              <th className="px-6 py-3">Vitórias</th>
              <th className="px-6 py-3">Empates</th>
              <th className="px-6 py-3">Derrotas</th>
              <th className="px-6 py-3">Pontos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-950">
            <tr className="hover:bg-gray-900 transition duration-150 ease-in-out">
              <td className="px-6 py-3">FutStat FC</td>
              <td className="px-6 py-3">10</td>
              <td className="px-6 py-3">7</td>
              <td className="px-6 py-3">2</td>
              <td className="px-6 py-3">1</td>
              <td className="px-6 py-3 text-green-500 font-bold">23</td>
            </tr>
            <tr className="hover:bg-gray-900 transition duration-150 ease-in-out">
              <td className="px-6 py-3">Estrelas do Norte</td>
              <td className="px-6 py-3">10</td>
              <td className="px-6 py-3">5</td>
              <td className="px-6 py-3">3</td>
              <td className="px-6 py-3">2</td>
              <td className="px-6 py-3 text-green-500 font-bold">18</td>
            </tr>
            <tr className="hover:bg-gray-900 transition duration-150 ease-in-out">
              <td className="px-6 py-3">Guerreiros FC</td>
              <td className="px-6 py-3">10</td>
              <td className="px-6 py-3">3</td>
              <td className="px-6 py-3">2</td>
              <td className="px-6 py-3">5</td>
              <td className="px-6 py-3 text-green-500 font-bold">11</td>
            </tr>
          </tbody>
        </Table>
      </div>

      {/* Modal para adicionar time */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay para escurecer o fundo */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsModalOpen(false)}
          ></div>
          {/* Conteúdo do Modal */}
          <div className="relative z-10 bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Adicionar Time</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                ✕
              </button>
            </div>
            <UpsertTeamsForm
              onSubmitSuccess={() => {
                setIsModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
