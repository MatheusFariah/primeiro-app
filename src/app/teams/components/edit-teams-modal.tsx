// src/app/teams/components/edit-team-modal.tsx

import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface EditTeamModalProps {
  team: {
    id: string;
    name: string;
    coach: string;
    players: number;
    value: string;
    founded: number;
  };
  onClose: () => void;
  onSave: (updatedTeam: any) => void;
}

const EditTeamModal = ({ team, onClose, onSave }: EditTeamModalProps) => {
  const [teamName, setTeamName] = useState(team.name);
  const [coach, setCoach] = useState(team.coach);
  const [players, setPlayers] = useState(team.players);
  const [value, setValue] = useState(team.value);
  const [founded, setFounded] = useState(team.founded);

  const handleSave = () => {
    const updatedTeam = {
      ...team,
      name: teamName,
      coach,
      players,
      value,
      founded,
    };
    onSave(updatedTeam); // Atualiza os dados do time no estado de Teams
    onClose(); // Fecha o modal
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-10 rounded-3xl shadow-xl shadow-black/30 w-[90%] sm:w-[600px] transition-all duration-300 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-extrabold tracking-tight text-white">
            Editar Time
          </h3>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-green-500 text-green-500 font-semibold hover:bg-green-800 hover:text-white transition-all duration-300 active:scale-95"
            aria-label="Fechar Modal"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-white font-bold">Nome do Time</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-800 text-white border-2 border-gray-700 focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-white font-bold">Técnico</label>
            <input
              type="text"
              value={coach}
              onChange={(e) => setCoach(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-800 text-white border-2 border-gray-700 focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-white font-bold">Jogadores</label>
            <input
              type="number"
              value={players}
              onChange={(e) => setPlayers(Number(e.target.value))}
              className="w-full p-2 rounded-md bg-gray-800 text-white border-2 border-gray-700 focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-white font-bold">Valor</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-800 text-white border-2 border-gray-700 focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-white font-bold">Fundação</label>
            <input
              type="number"
              value={founded}
              onChange={(e) => setFounded(Number(e.target.value))}
              className="w-full p-2 rounded-md bg-gray-800 text-white border-2 border-gray-700 focus:border-green-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Salvar
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTeamModal;
