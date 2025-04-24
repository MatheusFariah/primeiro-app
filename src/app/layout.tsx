// app/layout.tsx
import type { Metadata } from "next";
import Sidebar from "./components/sidebar";
import "./globals.css";

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
          <Sidebar />
          <main className="flex-1 px-8 py-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
