const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-5xl font-extrabold tracking-tight">
        <span className="text-white">Bem-vindo ao</span>{" "}
        <span className="text-green-500">FutStatics</span>
      </h2>

      <p className="text-gray-400 mt-4 text-lg">
        Aqui você pode rankear jogadores e acompanhar os melhores times!
      </p>
      <p className="text-sm text-gray-600 italic mt-2">
        O jogo muda quando os números entram em campo.
      </p>

      {/* Tabela estilizada */}
      <div className="mt-10 border border-gray-800 rounded-md overflow-hidden shadow">
        <table className="w-full text-base text-white text-left">
          <thead className="bg-gray-900 uppercase text-sm text-gray-400">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Partidas</th>
              <th className="px-6 py-3">Vitórias</th>
              <th className="px-6 py-3">Pontos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-950">
            <tr className="hover:bg-gray-900">
              <td className="px-6 py-3">Leões FC</td>
              <td className="px-6 py-3">10</td>
              <td className="px-6 py-3">7</td>
              <td className="px-6 py-3 text-green-500 font-bold">21</td>
            </tr>
            <tr className="hover:bg-gray-900">
              <td className="px-6 py-3">Dragões</td>
              <td className="px-6 py-3">10</td>
              <td className="px-6 py-3">6</td>
              <td className="px-6 py-3 text-green-500 font-bold">18</td>
            </tr>
            <tr className="hover:bg-gray-900">
              <td className="px-6 py-3">Furacões</td>
              <td className="px-6 py-3">10</td>
              <td className="px-6 py-3">5</td>
              <td className="px-6 py-3 text-green-500 font-bold">15</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
