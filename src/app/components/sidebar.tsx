"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  UsersRound,
  Trophy,
  ChevronDown,
  ChevronUp,
  ListOrdered,
} from "lucide-react";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const MenuItem = ({
    icon: Icon,
    label,
    href,
    hasChildren = false,
    children,
    active = false,
  }: {
    icon: React.ElementType;
    label: string;
    href?: string;
    hasChildren?: boolean;
    children?: React.ReactNode;
    active?: boolean;
  }) => (
    <div>
      {href ? (
        <Link
          href={href}
          className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition ${
            active ? "border-l-4 border-green-500 bg-gray-900" : ""
          }`}
        >
          <Icon size={18} />
          <span>{label}</span>
        </Link>
      ) : (
        <button
          onClick={() => hasChildren && toggleMenu(label)}
          className={`flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-800 transition ${
            active ? "border-l-4 border-green-500 bg-gray-900" : ""
          }`}
        >
          <div className="flex items-center gap-3 text-white">
            <Icon size={18} />
            <span>{label}</span>
          </div>
          {hasChildren && (
            <div className="text-white">
              {openMenu === label ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
          )}
        </button>
      )}
      {hasChildren && openMenu === label && (
        <div className="ml-8 mt-1 space-y-2">{children}</div>
      )}
    </div>
  );

  const SubItem = ({
    icon: Icon,
    label,
    href = "#",
  }: {
    icon: React.ElementType;
    label: string;
    href?: string;
  }) => (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition rounded-md"
    >
      <Icon size={16} />
      <span>{label}</span>
    </Link>
  );

  return (
    <aside className="w-72 h-screen bg-gray-950 text-white p-4 space-y-2 font-sans">
      <div className="mb-6 mt-2 flex justify-center">
        <h1 className="text-green-500 text-2xl font-extrabold tracking-wide">
          FutStatics
        </h1>
      </div>

      <MenuItem icon={Home} label="Início" href="/" />

      <MenuItem icon={UsersRound} label="Times" hasChildren>
        <SubItem icon={ListOrdered} label="Lista" href="/teams" />
      </MenuItem>

      <MenuItem icon={Trophy} label="Ligas" hasChildren>
        <SubItem icon={ListOrdered} label="Lista" href="/league" />
      </MenuItem>
    </aside>
  );
};

export default Sidebar;
