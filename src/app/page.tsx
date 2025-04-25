import Table from "./components/table";

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <header className="mb-12 text-center">
        <h2 className="text-5xl font-extrabold tracking-tight">
          <span className="text-white">Bem-vindo ao</span>{" "}
          <span style={{ color: "var(--highlight-green)" }}>FutStatics</span>
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          Aqui você pode{" "}
          <span className="font-bold">rankear jogadores</span> e{" "}
          <span className="font-bold">acompanhar os melhores times</span>!
        </p>
        <p className="mt-2 text-sm italic text-gray-600">
          O jogo muda quando os <span className="font-bold">números</span> entram em campo.
        </p>
      </header>

      {/* Tabela de Times utilizando o componente Table */}
      <section className="mt-10">
        <Table>
          <thead className="bg-gray-900 uppercase text-sm text-gray-400">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Partidas</th>
              <th className="px-6 py-3">Vitórias</th>
              <th className="px-6 py-3">Pontos</th>
            </tr>
          </thead>
          <tbody className="bg-gray-950">
            <tr className="hover:bg-gray-900 transition duration-150 ease-in-out">
              <td className="px-6 py-3">Leões FC</td>
              <td className="px-6 py-3">10</td>
              <td className="px-6 py-3">7</td>
              <td className="px-6 py-3 text-green-500 font-bold">21</td>
            </tr>
            <tr className="hover:bg-gray-900 transition duration-150 ease-in-out">
              <td className="px-6 py-3">Dragões</td>
              <td className="px-6 py-3">10</td>
              <td className="px-6 py-3">6</td>
              <td className="px-6 py-3 text-green-500 font-bold">18</td>
            </tr>
            <tr className="hover:bg-gray-900 transition duration-150 ease-in-out">
              <td className="px-6 py-3">Furacões</td>
              <td className="px-6 py-3">10</td>
              <td className="px-6 py-3">5</td>
              <td className="px-6 py-3 text-green-500 font-bold">15</td>
            </tr>
          </tbody>
        </Table>
      </section>
    </div>
  );
};

export default Home;
