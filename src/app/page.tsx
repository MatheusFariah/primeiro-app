// src/app/page.tsx
import Sidebar from "./components/sidebar";

const Home = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-l-2xl">
        {/* Título Principal */}
        <h2 className="text-5xl font-extrabold text-white">
          Bem-vindo ao <span className="text-green-500">FutStatics</span>
        </h2>

        {/* Descrição */}
        <p className="text-gray-400 mt-4 text-lg">
          Aqui você pode rankear jogadores e acompanhar os melhores times!
        </p>

        {/* Lista de Times */}
        <div className="mt-8">
          <h3 className="text-3xl font-semibold text-white">Times:</h3>
          <ul className="space-y-6 mt-6 text-white">
            <li className="border-b border-gray-600 py-4 hover:bg-gray-700 hover:translate-x-2 rounded-md transition-all duration-300">
              Time A
            </li>
            <li className="border-b border-gray-600 py-4 hover:bg-gray-700 hover:translate-x-2 rounded-md transition-all duration-300">
              Time B
            </li>
            <li className="border-b border-gray-600 py-4 hover:bg-gray-700 hover:translate-x-2 rounded-md transition-all duration-300">
              Time C
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
