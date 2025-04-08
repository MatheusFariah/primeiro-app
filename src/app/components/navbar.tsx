// src/app/components/navbar.tsx
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold">FutStatics</h1>
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:text-gray-400 transition duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/teams" className="hover:text-gray-400 transition duration-300">
              Times
            </Link>
          </li>
          <li>
            <Link href="/players" className="hover:text-gray-400 transition duration-300">
              Jogadores
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
