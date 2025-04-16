// pages/leagues.tsx ou components/Leagues.tsx
import Table from "../components/table";

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
];

const Leagues = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Texto de boas-vindas */}
      <div className="space-y-4">
        <h2 className="text-5xl font-black tracking-tight leading-tight text-center">
          <span className="text-white">Ligas</span>
        </h2>
        <p className="text-lg text-gray-300 leading-relaxed max-w-2xl text-center mx-auto">
          Aqui você pode{" "}
          <span className="text-white font-semibold">ver as principais ligas</span> e{" "}
          <span className="text-white font-semibold">acompanhar seus dados gerais</span>!
        </p>
      </div>

      {/* Tabela de ligas utilizando o componente Table */}
      <div className="mt-10">
        <Table>
          <thead className="bg-gray-900 uppercase text-sm text-gray-400">
            <tr>
              <th className="px-6 py-3">Liga</th>
              <th className="px-6 py-3">Times</th>
              <th className="px-6 py-3">Partidas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-950">
            {leagues.map((league) => (
              <tr
                key={league.id}
                className="hover:bg-gray-900 transition duration-150 ease-in-out"
              >
                <td className="px-6 py-3">{league.name}</td>
                <td className="px-6 py-3">{league.teamsCount}</td>
                <td className="px-6 py-3">{league.matches}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Leagues;
