'use client';
import Image from 'next/image';

export default function TeamsPage() {
  const teams = [
    {
      id: 1,
      name: 'Real Madrid',
      country: 'Espanha',
      coach: 'Carlo Ancelotti',
      founded: 1902,
      titles: 35,
      logoUrl: '/logos/real.png',
    },
    {
      id: 2,
      name: 'Manchester City',
      country: 'Inglaterra',
      coach: 'Pep Guardiola',
      founded: 1880,
      titles: 9,
      logoUrl: '/logos/city.png',
    },
    {
      id: 3,
      name: 'Palmeiras',
      country: 'Brasil',
      coach: 'Abel Ferreira',
      founded: 1914,
      titles: 11,
      logoUrl: '/logos/palmeiras.png',
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-yellow-400">Times</h1>
          <button className="bg-yellow-400 hover:bg-yellow-300 text-zinc-900 px-6 py-2 rounded-lg font-semibold transition-all">
            + Adicionar time
          </button>
        </header>

        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-yellow-300 text-sm uppercase tracking-wider">
              <th>ID</th>
              <th>Time</th>
              <th>País</th>
              <th>Técnico</th>
              <th>Fundado</th>
              <th>Títulos</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="bg-zinc-800 hover:bg-zinc-700 transition rounded-lg">
                <td className="px-4 py-3 rounded-l-lg">{team.id}</td>
                <td className="px-4 py-3 flex items-center gap-3">
                  <Image
                    src={team.logoUrl}
                    alt={team.name}
                    width={32}
                    height={32}
                    className="rounded-sm border border-zinc-700"
                  />
                  {team.name}
                </td>
                <td className="px-4 py-3">{team.country}</td>
                <td className="px-4 py-3">{team.coach}</td>
                <td className="px-4 py-3">{team.founded}</td>
                <td className="px-4 py-3 rounded-r-lg">{team.titles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
