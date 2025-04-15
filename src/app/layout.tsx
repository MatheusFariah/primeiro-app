import type { Metadata } from "next";
import Sidebar from "./components/sidebar";
import "./globals.css"; // Referencia o CSS global

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
      <body className="bg-black text-white font-sans">
        <div className="flex min-h-screen">
          {/* Sidebar com conteúdo fixo */}
          <Sidebar />

          {/* Conteúdo da página principal */}
          <main className="flex-1 px-10 py-14">{children}</main>
        </div>
      </body>
    </html>
  );
}
