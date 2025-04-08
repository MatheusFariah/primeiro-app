// src/app/components/sidebar.tsx
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="w-72 h-screen bg-gray-900 text-white shadow-lg">
      <div className="flex flex-col p-6">
        <h2 className="text-3xl font-bold mb-6 text-green-500">FutStatics</h2>
        <ul className="space-y-6">
          <li className="border-2 border-transparent hover:border-green-500 px-4 py-2 rounded-md transition-all duration-300 hover:bg-gray-800">
            <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
          </li>
          <li className="border-2 border-transparent hover:border-green-500 px-4 py-2 rounded-md transition-all duration-300 hover:bg-gray-800">
            <Link href="/teams" className="text-gray-300 hover:text-white">Times</Link>
          </li>
          <li className="border-2 border-transparent hover:border-green-500 px-4 py-2 rounded-md transition-all duration-300 hover:bg-gray-800">
            <Link href="/players" className="text-gray-300 hover:text-white">Jogadores</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
