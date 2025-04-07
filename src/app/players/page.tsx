'use client';

export default function PlayersPage() {
  const players = [
    { id: 1, name: 'Lionel Messi', position: 'Atacante', team: 'Inter Miami' },
    { id: 2, name: 'Cristiano Ronaldo', position: 'Atacante', team: 'Al-Nassr' },
    { id: 3, name: 'Neymar Jr.', position: 'Meia', team: 'Al-Hilal' },
  ];

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-yellow-400">Jogadores</h1>
          <button className="bg-yellow-400 hover:bg-yellow-300 text-zinc-900 px-6 py-2 rounded-lg font-semibold transition-all">
            + Adicionar jogador
          </button>
        </header>

        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-yellow-300 text-sm uppercase tracking-wider">
              <th>Nome</th>
              <th>Posição</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="bg-zinc-800 hover:bg-zinc-700 transition rounded-lg">
                <td className="px-4 py-3 rounded-l-lg">{player.name}</td>
                <td className="px-4 py-3">{player.position}</td>
                <td className="px-4 py-3 rounded-r-lg">{player.team}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
  