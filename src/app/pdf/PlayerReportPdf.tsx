"use client";
import React from "react";
import { PlayerInfo, PlayerStats } from "@/app/pdf/PlayerReportData";

interface PlayerStatsReportViewProps {
  player: PlayerInfo & {
    value: number;
    join_date: string;
    nationality: string;
  };
  stats: PlayerStats;
  graphImage?: string | null;
}

export default function PlayerStatsReportView({
  player,
  stats,
  graphImage,
}: PlayerStatsReportViewProps) {
  return (
    <div className="bg-white text-gray-900 rounded-xl p-6 shadow-md">
      {/* Cabeçalho com ícone e título */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-highlight-green rounded-md flex items-center justify-center">
          <img src="/assets/icone.png" alt="Ícone" className="w-12 h-12" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-highlight-green">Relatório do Jogador</h2>
          <p className="text-gray-600 text-sm">Gerado por Futstatics</p>
        </div>
      </div>

      {/* Informações pessoais */}
      <div className="mb-6">
        <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Informações Pessoais</h3>
        <ul className="text-sm space-y-1">
          <li><strong>Nome:</strong> {player.nome}</li>
          <li><strong>Posição:</strong> {player.posicao}</li>
          <li><strong>Time:</strong> {player.time}</li>
          <li><strong>Temporada:</strong> {player.temporada}</li>
          <li><strong>Nacionalidade:</strong> {player.nationality}</li>
          <li><strong>Valor:</strong> R${player.value.toFixed(2)}</li>
          <li><strong>Data de Contratação:</strong> {new Date(player.join_date).toLocaleDateString("pt-BR")}</li>
          <li><strong>Data do Relatório:</strong> {player.dataRelatorio}</li>
        </ul>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="mb-6">
          <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Estatísticas</h3>
          <ul className="text-sm space-y-1 columns-2 gap-x-6">
            <li><strong>Partidas:</strong> {stats.partidas}</li>
            <li><strong>Gols:</strong> {stats.gols}</li>
            <li><strong>Assistências:</strong> {stats.assistencias}</li>
            <li><strong>Passes Certos:</strong> {stats.passesCertos}</li>
            <li><strong>Passes Errados:</strong> {stats.passesErrados}</li>
            <li><strong>Desarmes:</strong> {stats.desarmes}</li>
            <li><strong>Dribles:</strong> {stats.dribles}</li>
            {stats.defesas !== undefined && (
              <>
                <li><strong>Defesas:</strong> {stats.defesas}</li>
                <li><strong>Gols Sofridos:</strong> {stats.golsSofridos}</li>
                <li><strong>Pênaltis Defendidos:</strong> {stats.penaltisDefendidos}</li>
                <li><strong>Pênaltis Enfrentados:</strong> {stats.penaltisEnfrentados}</li>
              </>
            )}
            {stats.cruzamentos !== undefined && (
              <li><strong>Cruzamentos:</strong> {stats.cruzamentos}</li>
            )}
            <li><strong>Amarelos:</strong> {stats.amarelos}</li>
            <li><strong>Vermelhos:</strong> {stats.vermelhos}</li>
          </ul>
        </div>
      )}

      {/* Gráfico */}
      {graphImage && (
        <div className="mb-4">
          <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Gráfico de Desempenho</h3>
          <img src={graphImage} alt="Gráfico" className="w-full h-auto rounded-md" />
        </div>
      )}
    </div>
  );
}
