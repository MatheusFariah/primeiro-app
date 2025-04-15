const Teams = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Texto de boas-vindas */}
      <div className="space-y-4">
        <h2 className="text-5xl font-black tracking-tight leading-tight">
          <span className="text-white">Times</span>{" "}
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

      {/* Tabela de classificação de times */}
      <div className="mt-10 border border-gray-800 rounded-md overflow-hidden shadow table-shadow">
        <table className="w-full text-base text-white text-left">
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
            <tr className="hover:bg-gray-900">
              <td className="px-6 py-3">FutStat FC</td>
              <td className="px-6 py-3">10</td>
              <td className="px-6 py-3">7</td>
              <td className="px-6 py-3">2</td>
              <td className="px-6 py-3">1</td>
              <td className="px-6 py-3 text-green-500 font-bold">23</td>
            </tr>
            <tr className="hover:bg-gray-900">
              <td className="px-6 py-3">Estrelas do Norte</td>
              <td className="px-6 py-3">10</td>
              <td className="px-6 py-3">5</td>
              <td className="px-6 py-3">3</td>
              <td className="px-6 py-3">2</td>
              <td className="px-6 py-3 text-green-500 font-bold">18</td>
            </tr>
            <tr className="hover:bg-gray-900">
              <td className="px-6 py-3">Guerreiros FC</td>
              <td className="px-6 py-3">10</td>
              <td className="px-6 py-3">3</td>
              <td className="px-6 py-3">2</td>
              <td className="px-6 py-3">5</td>
              <td className="px-6 py-3 text-green-500 font-bold">11</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Teams; 