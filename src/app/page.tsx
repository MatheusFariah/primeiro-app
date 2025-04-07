"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-12 relative overflow-hidden">
      {/* Wallpaper perfeitamente centralizado */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <Image
          src="/wallpaper-bom.png"
          alt="FutStatics Background"
          layout="fill"
          objectFit="cover"
          className="opacity-15 select-none pointer-events-none scale-[1.2] translate-x-[19px]"
        />
      </div>

      {/* Conteúdo centralizado */}
      <div className="flex items-center justify-center h-full relative z-10">
        <div className="text-center">
          <Image
            src="/logohome.png"
            alt="FutStatics logo"
            width={200}
            height={200}
            className="rounded-full border-4 border-yellow-500 mb-6 mx-auto"
            priority
          />

          <h1 className="text-5xl sm:text-6xl font-extrabold text-yellow-400 tracking-wide">
            FutStatics
          </h1>

          <p className="text-zinc-300 text-lg sm:text-xl max-w-xl mt-4 leading-relaxed mx-auto">
            A melhor plataforma para gerenciar seu time e escalar jogadores,
            tudo com estilo e precisão.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 mt-10 justify-center">
            <Link
              href="/players"
              className="bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-bold px-8 py-3 rounded-full text-lg w-full sm:w-[200px] text-center transition-colors duration-300"
            >
              Ranking
            </Link>
            <Link
              href="/teams"
              className="border-2 border-yellow-400 hover:bg-yellow-500 hover:text-zinc-900 text-yellow-400 font-bold px-8 py-3 rounded-full text-lg w-full sm:w-[200px] text-center transition-colors duration-300"
            >
              Times
            </Link>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-zinc-500 z-10">
        © {new Date().getFullYear()}{" "}
        <span className="text-yellow-500/70">FutStatics</span> — por Matheus
        Faria
      </footer>
    </main>
  );
}
