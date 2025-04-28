"use client";  // Isso garante que o código seja executado no lado do cliente

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  UsersRound,
  Trophy,
  ChevronDown,
  ChevronUp,
  Menu,
} from "lucide-react";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);  // Novo estado para verificar se está no cliente

  useEffect(() => {
    setIsClient(true);  // Garantir que está no cliente
  }, []);

  const toggleMenu = (menu: string) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const MenuItem = ({
    icon: Icon,
    label,
    href,
    hasChildren = false,
    children,
  }: {
    icon: React.ElementType;
    label: string;
    href?: string;
    hasChildren?: boolean;
    children?: React.ReactNode;
  }) => (
    <div className="space-y-1">
      {href && !hasChildren ? (
        <Link
          href={href}
          className="flex items-center gap-3 px-4 py-3 rounded-md border-l-4 border-transparent transition-colors hover:border-gray-800"
        >
          <Icon size={18} className="text-[var(--foreground)]" />
          <span className="font-medium">{label}</span>
        </Link>
      ) : (
        <button
          onClick={() => hasChildren && toggleMenu(label)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-md border-l-4 border-transparent transition-colors hover:border-gray-800"
        >
          <div className="flex items-center gap-3">
            <Icon size={18} className="text-[var(--foreground)]" />
            <span className="font-medium">{label}</span>
          </div>
          {hasChildren && (
            <div className="text-[var(--foreground)]">
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
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 rounded-md"
    >
      <Icon size={16} />
      <span>{label}</span>
    </Link>
  );

  if (!isClient) return null;  // Garante que o componente só será renderizado no cliente

  return (
    <aside className="sidebar w-64 flex-shrink-0 bg-gradient-to-b from-gray-900 to-[#111827] shadow-lg flex flex-col justify-between p-6">
      <div>
        <div className="mb-6 mt-4 flex items-center justify-center">
          <h1 className="text-[var(--highlight-green)] text-2xl font-extrabold tracking-wide">
            FutStatics
          </h1>
        </div>
        <nav className="space-y-2">
          <MenuItem icon={Home} label="Início" href="/" />
          <MenuItem icon={UsersRound} label="Times" hasChildren>
            <SubItem icon={Menu} label="Lista" href="/teams" />
          </MenuItem>
          <MenuItem icon={Trophy} label="Ligas" hasChildren>
            <SubItem icon={Menu} label="Lista" href="/league" />
          </MenuItem>
        </nav>
      </div>
      <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
        © {new Date().getFullYear()} FutStatics
      </div>
    </aside>
  );
};

export default Sidebar;
