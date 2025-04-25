"use client";

import Table from "../../components/table";

interface TeamPlayersTableProps {
  teamId: string;
}

const mockPlayers = [
  { id: 1, name: "Jogador 1", position: "Atacante", number: 9 },
  { id: 2, name: "Jogador 2", position: "Meio-campo", number: 10 },
  { id: 3, name: "Jogador 3", position: "Zagueiro", number: 4 },
];

export default function TeamPlayersTable({ teamId }: TeamPlayersTableProps) {
  const players = mockPlayers;

  return (
    <div className="bg-gray-950 border border-white/10 rounded-lg overflow-hidden">
      <Table>
        <>
          <thead className="bg-gray-900 uppercase text-gray-400">
            <tr>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Posição</th>
              <th className="px-4 py-2 text-left">Número</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {players.map((player) => (
              <tr key={player.id} className="hover:bg-gray-900">
                <td className="px-4 py-2">{player.name}</td>
                <td className="px-4 py-2">{player.position}</td>
                <td className="px-4 py-2">{player.number}</td>
              </tr>
            ))}
          </tbody>
        </>
      </Table>
    </div>
  );
}
