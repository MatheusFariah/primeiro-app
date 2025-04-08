// src/app/players/page.tsx
import Sidebar from "../components/sidebar";

const PlayersPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-4xl font-bold text-white">Jogadores</h2>
        <p className="text-white mt-4">Aqui estão os jogadores cadastrados:</p>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-white">Lista de Jogadores:</h3>
          <ul className="space-y-4 mt-4 text-white">
            <li className="border-b border-gray-600 py-2">Jogador 1</li>
            <li className="border-b border-gray-600 py-2">Jogador 2</li>
            <li className="border-b border-gray-600 py-2">Jogador 3</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlayersPage;
