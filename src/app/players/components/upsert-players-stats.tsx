// players/components/UpsertPlayerStatsForm.tsx
"use client";

import { JSX } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { Save } from "lucide-react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

interface PlayerStats {
  id?: number;
  players_id: number;
  goals: number;
  assists: number;
  matches_played: number;
  yellow_cards: number;
  red_cards: number;
  correct_passes: number;
  incorrect_passes: number;
  successful_shots: number;
  unsuccessful_shots: number;
  interceptions: number;
  dribbles: number;
  // Campos de goleiro (usados apenas se position === "GOL")
  goals_conceded?: number;
  saves?: number;
  clean_sheets?: number;
  penalties_saved?: number;
  penalties_faced?: number;
  high_claims?: number;
}

interface UpsertPlayerStatsFormProps {
  playerId: number;
  existingStats?: PlayerStats | null;
  position: string; // ex: "GOL", "VOL", "ATA"...
  onSubmitSuccess: () => void;
}

interface FormValues {
  goals: string;
  assists: string;
  matches_played: string;
  yellow_cards: string;
  red_cards: string;
  correct_passes: string;
  incorrect_passes: string;
  successful_shots: string;
  unsuccessful_shots: string;
  interceptions: string;
  dribbles: string;
  // Campos de goleiro
  goals_conceded: string;
  saves: string;
  clean_sheets: string;
  penalties_saved: string;
  penalties_faced: string;
  high_claims: string;
}

export default function UpsertPlayerStatsForm({
  playerId,
  existingStats = null,
  position,
  onSubmitSuccess,
}: UpsertPlayerStatsFormProps) {
  // 1) Monta initialValues a partir de existingStats (ou zera tudo se for null)
  const initialValues: FormValues = {
    goals: existingStats?.goals?.toString() ?? "0",
    assists: existingStats?.assists?.toString() ?? "0",
    matches_played: existingStats?.matches_played?.toString() ?? "0",
    yellow_cards: existingStats?.yellow_cards?.toString() ?? "0",
    red_cards: existingStats?.red_cards?.toString() ?? "0",
    correct_passes: existingStats?.correct_passes?.toString() ?? "0",
    incorrect_passes: existingStats?.incorrect_passes?.toString() ?? "0",
    successful_shots: existingStats?.successful_shots?.toString() ?? "0",
    unsuccessful_shots: existingStats?.unsuccessful_shots?.toString() ?? "0",
    interceptions: existingStats?.interceptions?.toString() ?? "0",
    dribbles: existingStats?.dribbles?.toString() ?? "0",
    goals_conceded: existingStats?.goals_conceded?.toString() ?? "0",
    saves: existingStats?.saves?.toString() ?? "0",
    clean_sheets: existingStats?.clean_sheets?.toString() ?? "0",
    penalties_saved: existingStats?.penalties_saved?.toString() ?? "0",
    penalties_faced: existingStats?.penalties_faced?.toString() ?? "0",
    high_claims: existingStats?.high_claims?.toString() ?? "0",
  };

  // 2) Validação de campos “comuns a todas as posições”
  const commonStatsSchema = {
    goals: Yup.number()
      .typeError("Gols deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório."),
    assists: Yup.number()
      .typeError("Assistências deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório."),
    matches_played: Yup.number()
      .typeError("Jogos disputados deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório."),
    yellow_cards: Yup.number()
      .typeError("Cartões amarelos deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório."),
    red_cards: Yup.number()
      .typeError("Cartões vermelhos deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório."),
    correct_passes: Yup.number()
      .typeError("Passes corretos deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório."),
    incorrect_passes: Yup.number()
      .typeError("Passes incorretos deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório."),
    successful_shots: Yup.number()
      .typeError("Chutes certos deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório."),
    unsuccessful_shots: Yup.number()
      .typeError("Chutes errados deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório."),
    interceptions: Yup.number()
      .typeError("Interceptações deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório."),
    dribbles: Yup.number()
      .typeError("Dribles deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório."),
  };

  // 3) Validação específica para goleiros
  const goalkeeperStatsSchema = {
    goals_conceded: Yup.number()
      .typeError("Gols sofridos deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório para goleiro."),
    saves: Yup.number()
      .typeError("Defesas deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório para goleiro."),
    clean_sheets: Yup.number()
      .typeError("Clean sheets deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório para goleiro."),
    penalties_saved: Yup.number()
      .typeError("Pênaltis defendidos deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório para goleiro."),
    penalties_faced: Yup.number()
      .typeError("Pênaltis enfrentados deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório para goleiro."),
    high_claims: Yup.number()
      .typeError("High claims deve ser um número.")
      .integer("Deve ser inteiro.")
      .min(0, "Não pode ser negativo.")
      .required("Obrigatório para goleiro."),
  };

  // 4) Monta o validationSchema do Yup, dependendo da posição
  const validationSchema = Yup.object().shape({
    ...commonStatsSchema,
    ...(position === "GOL" ? goalkeeperStatsSchema : {}),
  });

  // 5) Função de submissão
  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    formikHelpers.setSubmitting(true);
    formikHelpers.setStatus(null);

    const payload: PlayerStats = {
      players_id: playerId,
      goals: Number(values.goals),
      assists: Number(values.assists),
      matches_played: Number(values.matches_played),
      yellow_cards: Number(values.yellow_cards),
      red_cards: Number(values.red_cards),
      correct_passes: Number(values.correct_passes),
      incorrect_passes: Number(values.incorrect_passes),
      successful_shots: Number(values.successful_shots),
      unsuccessful_shots: Number(values.unsuccessful_shots),
      interceptions: Number(values.interceptions),
      dribbles: Number(values.dribbles),
      goals_conceded:
        position === "GOL" ? Number(values.goals_conceded) : 0,
      saves: position === "GOL" ? Number(values.saves) : 0,
      clean_sheets:
        position === "GOL" ? Number(values.clean_sheets) : 0,
      penalties_saved:
        position === "GOL" ? Number(values.penalties_saved) : 0,
      penalties_faced:
        position === "GOL" ? Number(values.penalties_faced) : 0,
      high_claims: position === "GOL" ? Number(values.high_claims) : 0,
    };

    try {
      if (existingStats && existingStats.id) {
        const { error: updateError } = await supabase
          .from("player_statics")
          .update(payload)
          .eq("id", existingStats.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("player_statics")
          .insert(payload);
        if (insertError) throw insertError;
      }
      onSubmitSuccess();
    } catch (err: any) {
      formikHelpers.setStatus(err.message || "Erro inesperado.");
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  // 6) Classe CSS padrão para todos os inputs (mesmo visual do EditPlayersForm)
  const baseInputClass =
    "w-full h-[48px] px-3 rounded-md bg-gray-800 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-highlight-green focus:outline-none transition-all duration-300";

  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-6 text-white">
            {status && (
              <div className="bg-red-600 text-white text-sm px-4 py-2 rounded-md">
                {status}
              </div>
            )}

            {/* LINHA 1 */}
            <div className="grid grid-cols-4 gap-4">
              {/* Gols */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Gols
                </label>
                <Field
                  type="number"
                  name="goals"
                  placeholder="0"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="goals"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Assistências */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Assistências
                </label>
                <Field
                  type="number"
                  name="assists"
                  placeholder="0"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="assists"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Jogos Disputados */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Jogos Disputados
                </label>
                <Field
                  type="number"
                  name="matches_played"
                  placeholder="0"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="matches_played"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Cartões Amarelos */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Cartões Amarelos
                </label>
                <Field
                  type="number"
                  name="yellow_cards"
                  placeholder="0"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="yellow_cards"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            {/* LINHA 2 */}
            <div className="grid grid-cols-4 gap-4">
              {/* Cartões Vermelhos */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Cartões Vermelhos
                </label>
                <Field
                  type="number"
                  name="red_cards"
                  placeholder="0"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="red_cards"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Passes Corretos */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Passes Corretos
                </label>
                <Field
                  type="number"
                  name="correct_passes"
                  placeholder="0"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="correct_passes"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Passes Incorretos */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Passes Incorretos
                </label>
                <Field
                  type="number"
                  name="incorrect_passes"
                  placeholder="0"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="incorrect_passes"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Chutes Certos */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Chutes Certos
                </label>
                <Field
                  type="number"
                  name="successful_shots"
                  placeholder="0"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="successful_shots"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            {/* LINHA 3 */}
            <div className="grid grid-cols-4 gap-4">
              {/* Chutes Errados */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Chutes Errados
                </label>
                <Field
                  type="number"
                  name="unsuccessful_shots"
                  placeholder="0"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="unsuccessful_shots"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Interceptações */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Interceptações
                </label>
                <Field
                  type="number"
                  name="interceptions"
                  placeholder="0"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="interceptions"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Dribles */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Dribles
                </label>
                <Field
                  type="number"
                  name="dribbles"
                  placeholder="0"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="dribbles"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Espaço em branco para manter grid 4-colunas */}
              <div></div>
            </div>

            {/* CAMPOS DE GOLEIRO (APENAS SE position === "GOL") */}
            {position === "GOL" && (
              <div className="mt-6 border-t border-gray-700 pt-6 space-y-4">
                <h4 className="text-lg font-semibold text-gray-300">
                  Estatísticas de Goleiro
                </h4>
                <div className="grid grid-cols-4 gap-4">
                  {/* Gols Sofridos */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                      Gols Sofridos
                    </label>
                    <Field
                      type="number"
                      name="goals_conceded"
                      placeholder="0"
                      className={baseInputClass}
                    />
                    <ErrorMessage
                      name="goals_conceded"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Defesas (saves) */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                      Defesas
                    </label>
                    <Field
                      type="number"
                      name="saves"
                      placeholder="0"
                      className={baseInputClass}
                    />
                    <ErrorMessage
                      name="saves"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Clean Sheets */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                      Clean Sheets
                    </label>
                    <Field
                      type="number"
                      name="clean_sheets"
                      placeholder="0"
                      className={baseInputClass}
                    />
                    <ErrorMessage
                      name="clean_sheets"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Pênaltis Defendidos */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                      Pênaltis Def.
                    </label>
                    <Field
                      type="number"
                      name="penalties_saved"
                      placeholder="0"
                      className={baseInputClass}
                    />
                    <ErrorMessage
                      name="penalties_saved"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Pênaltis Enfrentados */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                      Pênaltis Enfr.
                    </label>
                    <Field
                      type="number"
                      name="penalties_faced"
                      placeholder="0"
                      className={baseInputClass}
                    />
                    <ErrorMessage
                      name="penalties_faced"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* High Claims */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                      High Claims
                    </label>
                    <Field
                      type="number"
                      name="high_claims"
                      placeholder="0"
                      className={baseInputClass}
                    />
                    <ErrorMessage
                      name="high_claims"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Espaço em branco para completar a última coluna */}
                  <div></div>
                </div>
              </div>
            )}

            {/* BOTÃO DE SALVAR */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-black transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Salvar Estatísticas"
              >
                <Save className="w-5 h-5" />
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
