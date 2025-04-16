import type { Metadata } from "next";
import Sidebar from "./components/sidebar";
import "./globals.css"; // Referência ao CSS global

export const metadata: Metadata = {
  title: "FutStatics",
  description: "Sistema de futebol com estatísticas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-[var(--foreground)] font-sans">
        <div className="flex min-h-screen">
          {/* Sidebar fixa */}
          <Sidebar />

          {/* Conteúdo principal centralizado */}
          <main className="flex-1 flex items-center justify-center px-8 py-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
