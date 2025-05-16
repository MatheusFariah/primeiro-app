export interface PlayerInfo {
  nome: string;
  posicao: string;
  time: string;
  temporada: string;
  dataRelatorio: string;
  nationality: string;
  value: number;
  join_date: string;
}

export interface PlayerStats {
  partidas: number;
  gols: number;
  assistencias: number;
  passesCertos: number;
  passesErrados: number;
  desarmes: number;
  dribles: number;
  defesas?: number;
  golsSofridos?: number;
  penaltisDefendidos?: number;
  penaltisEnfrentados?: number;
  cruzamentos?: number;
  amarelos: number;
  vermelhos: number;
}
