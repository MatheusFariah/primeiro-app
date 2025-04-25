"use client";

const Players = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Texto de boas-vindas */}
      <div className="space-y-4 text-center">
        <h2 className="text-5xl font-black text-white">Jogadores</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Aqui você pode{" "}
          <span className="text-white font-semibold">avaliar jogadores</span> e{" "}
          <span className="text-white font-semibold">acompanhar suas estatísticas</span>!
        </p>
      </div>

      {/* Tabela de classificação de jogadores */}
      <div className="mt-10 border border-gray-800 rounded-md overflow-hidden shadow table-shadow">
        <table className="w-full text-base text-white text-left">
          <>
            <thead className="bg-gray-900 uppercase text-sm text-gray-400">
              <tr>
                <th className="px-6 py-3 text-left">Jogador</th>
                <th className="px-6 py-3 text-left">Posição</th>
                <th className="px-6 py-3 text-left">Partidas</th>
                <th className="px-6 py-3 text-left">Gols</th>
                <th className="px-6 py-3 text-left">Assistências</th>
                <th className="px-6 py-3 text-left">Pontos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-gray-950">
              <tr className="hover:bg-gray-900 transition duration-150">
                <td className="px-6 py-3">João Silva</td>
                <td className="px-6 py-3">Atacante</td>
                <td className="px-6 py-3">10</td>
                <td className="px-6 py-3">5</td>
                <td className="px-6 py-3">2</td>
                <td className="px-6 py-3 text-green-500 font-bold">15</td>
              </tr>
              <tr className="hover:bg-gray-900 transition duration-150">
                <td className="px-6 py-3">Carlos Pereira</td>
                <td className="px-6 py-3">Meia</td>
                <td className="px-6 py-3">10</td>
                <td className="px-6 py-3">3</td>
                <td className="px-6 py-3">5</td>
                <td className="px-6 py-3 text-green-500 font-bold">12</td>
              </tr>
              <tr className="hover:bg-gray-900 transition duration-150">
                <td className="px-6 py-3">Lucas Almeida</td>
                <td className="px-6 py-3">Defensor</td>
                <td className="px-6 py-3">10</td>
                <td className="px-6 py-3">0</td>
                <td className="px-6 py-3">1</td>
                <td className="px-6 py-3 text-green-500 font-bold">8</td>
              </tr>
            </tbody>
          </>
        </table>
      </div>
    </div>
  );
};

export default Players;
