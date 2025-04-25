"use client";

import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { useState } from "react";
import TeamPlayersTable from "../components/team-players-table";
import UpsertPlayersForm from "../../players/components/upsert-players-form";

interface TeamBottomSlideOverProps {
  team: {
    id: string;
    name: string;
  };
  onClose: () => void;
}

export default function TeamBottomSlideOver({
  team,
  onClose,
}: TeamBottomSlideOverProps) {
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);

  return (
    <div className="fixed inset-0 flex justify-center items-end z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Slide Over */}
      <div
        className="
    relative w-full bg-gradient-to-br from-gray-800/90 to-gray-900/90 
    border-t border-white/10 shadow-xl shadow-black/30 
    rounded-t-3xl p-8 overflow-y-auto scrollbar-hidden h-[60%]
    animate-slide-up transition-all duration-300
  "
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2
            className="text-3xl font-extrabold tracking-tight text-white"
            style={{ color: "var(--highlight-green)" }}
          >
            Jogadores - {team.name}
          </h2>
          <button
            onClick={onClose}
            className="
              w-12 h-12 flex items-center justify-center 
              rounded-full border-2 border-green-500 
              text-green-500 hover:bg-green-800 hover:text-white 
              transition-all duration-300 active:scale-95
            "
            aria-label="Fechar"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        {/* Lista de Jogadores */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Jogadores</h3>
            <button
              onClick={() => setIsAddingPlayer(true)}
              className="
                flex items-center gap-2 
                rounded-md border-2 border-green-500 px-4 py-2 
                text-green-500 hover:bg-green-800 hover:text-white 
                transition-all duration-300 text-sm font-semibold
              "
            >
              <AiOutlinePlus size={16} /> Jogador
            </button>
          </div>

          {/* Tabela de Jogadores */}
          <TeamPlayersTable teamId={team.id} />
        </div>

        {/* Modal interno para adicionar jogador */}
        {isAddingPlayer && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsAddingPlayer(false)}
            />
            {/* Formulário */}
            <div
              className="
                relative z-10 
                bg-gradient-to-br from-gray-800/80 to-gray-900/80 
                p-8 rounded-3xl shadow-xl shadow-black/30 
                w-[90%] sm:w-[500px] border border-white/10
              "
            >
              <UpsertPlayersForm
                onSubmitSuccess={() => setIsAddingPlayer(false)}
                teamId={team.id}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
