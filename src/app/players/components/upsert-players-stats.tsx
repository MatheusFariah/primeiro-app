"use client";

import { JSX, useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { Save } from "lucide-react";
import Swal from "sweetalert2";

interface UpsertPlayerStatsProps {
  playerId: number;
  existingStats: any; // objeto retornado do Supabase ou null
  onSubmitSuccess: () => void;
  onCancel?: () => void;
}

export default function UpsertPlayerStats({
  playerId,
  existingStats,
  onSubmitSuccess,
  onCancel,
}: UpsertPlayerStatsProps) {
  const [form, setForm] = useState({
    goals: "",
    assists: "",
    matches_played: "",
    yellow_cards: "",
    red_cards: "",
    correct_passes: "",
    incorrect_passes: "",
    successful_shots: "",
    unsuccessful_shots: "",
    interceptions: "",
    dribbles: "",
    goals_conceded: "",
    saves: "",
    clean_sheets: "",
    penalties_saved: "",
    penalties_faced: "",
    high_claims: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ao montar ou quando existingStats mudar, pré‐preenchemos o formulário
  useEffect(() => {
    if (existingStats) {
      setForm({
        goals: String(existingStats.goals ?? ""),
        assists: String(existingStats.assists ?? ""),
        matches_played: String(existingStats.matches_played ?? ""),
        yellow_cards: String(existingStats.yellow_cards ?? ""),
        red_cards: String(existingStats.red_cards ?? ""),
        correct_passes: String(existingStats.correct_passes ?? ""),
        incorrect_passes: String(existingStats.incorrect_passes ?? ""),
        successful_shots: String(existingStats.successful_shots ?? ""),
        unsuccessful_shots: String(existingStats.unsuccessful_shots ?? ""),
        interceptions: String(existingStats.interceptions ?? ""),
        dribbles: String(existingStats.dribbles ?? ""),
        goals_conceded: String(existingStats.goals_conceded ?? ""),
        saves: String(existingStats.saves ?? ""),
        clean_sheets: String(existingStats.clean_sheets ?? ""),
        penalties_saved: String(existingStats.penalties_saved ?? ""),
        penalties_faced: String(existingStats.penalties_faced ?? ""),
        high_claims: String(existingStats.high_claims ?? ""),
      });
    }
  }, [existingStats]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Montamos o payload convertendo strings em números
    const payload: any = {
      players_id: playerId,
      goals: Number(form.goals),
      assists: Number(form.assists),
      matches_played: Number(form.matches_played),
      yellow_cards: Number(form.yellow_cards),
      red_cards: Number(form.red_cards),
      correct_passes: Number(form.correct_passes),
      incorrect_passes: Number(form.incorrect_passes),
      successful_shots: Number(form.successful_shots),
      unsuccessful_shots: Number(form.unsuccessful_shots),
      interceptions: Number(form.interceptions),
      dribbles: Number(form.dribbles),
      goals_conceded: Number(form.goals_conceded),
      saves: Number(form.saves),
      clean_sheets: Number(form.clean_sheets),
      penalties_saved: Number(form.penalties_saved),
      penalties_faced: Number(form.penalties_faced),
      high_claims: Number(form.high_claims),
    };

    // Se já existe um registro, inclua o id para que o upsert saiba fazer update
    if (existingStats && existingStats.id) {
      payload.id = existingStats.id;
    }

    const { error: upsertError } = await supabase
      .from("player_statics")
      .upsert(payload, { onConflict: "players_id" });

    setLoading(false);

    if (upsertError) {
      setError(upsertError.message);
      return;
    }

    Swal.fire({
      title: existingStats && existingStats.id ? "Atualizado!" : "Criado!",
      text: "Estatísticas salvas com sucesso.",
      icon: "success",
      background: "#1f2937",
      color: "#f3f4f6",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      customClass: { popup: "rounded-lg shadow-lg" },
    });

    onSubmitSuccess();
  };

  const renderField = (
    label: string,
    name: keyof typeof form,
    placeholder = ""
  ) => (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
        {label}
      </label>
      <input
        type="number"
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        min={0}
        className="w-full h-[48px] px-3 rounded-md bg-gray-800 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-highlight-green focus:outline-none transition-all duration-300"
      />
    </div>
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 text-white">
        {error && (
          <div className="bg-red-600 text-white text-sm px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {renderField("Gols", "goals")}
          {renderField("Assistências", "assists")}
          {renderField("Partidas Jogadas", "matches_played")}
          {renderField("Cartões Amarelos", "yellow_cards")}
          {renderField("Cartões Vermelhos", "red_cards")}
          {renderField("Passes Corretos", "correct_passes")}
          {renderField("Passes Incorretos", "incorrect_passes")}
          {renderField("Finalizações Certas", "successful_shots")}
          {renderField("Finalizações Erradas", "unsuccessful_shots")}
          {renderField("Interceptações", "interceptions")}
          {renderField("Dribles", "dribbles")}
          {renderField("Gols Sofridos", "goals_conceded")}
          {renderField("Defesas", "saves")}
          {renderField("Jogos sem Sofrer Gol", "clean_sheets")}
          {renderField("Pênaltis Defendidos", "penalties_saved")}
          {renderField("Pênaltis Sofridos", "penalties_faced")}
          {renderField("Defesas Altas", "high_claims")}
        </div>

        <div className="flex justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={() => onCancel()}
              className="px-4 py-2 mr-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-black transition-colors shadow-md"
            aria-label="Salvar Estatísticas"
          >
            <Save className="w-5 h-5" />
          </button>
        </div>
      </form>
    </>
  );
}
