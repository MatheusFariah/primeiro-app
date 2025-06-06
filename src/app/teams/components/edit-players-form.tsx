"use client";

import { JSX, useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { countries } from "@/app/utils/countries";
import { Save } from "lucide-react";
import { NumericFormat } from "react-number-format";
import Swal from "sweetalert2";

interface EditPlayersFormProps {
  teamId: number;
  existingPlayer: any;
  onSubmitSuccess: () => void;
}

export default function EditPlayersForm({
  teamId,
  existingPlayer,
  onSubmitSuccess,
}: EditPlayersFormProps): JSX.Element {
  const [form, setForm] = useState({
    name: "",
    age: "",
    dob: "",
    position: "",
    nationality: "BR",
    status: "ativo",
    weight: "",
    height: "",
    join_date: "",
    value: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingPlayer) {
      setForm({
        name: existingPlayer.name || "",
        age: existingPlayer.age?.toString() || "",
        dob: existingPlayer.dob || "",
        position: existingPlayer.position || "",
        nationality: existingPlayer.nationality || "BR",
        status: existingPlayer.status || "ativo",
        weight: existingPlayer.weight
          ? existingPlayer.weight.toString().replace(".", ",")
          : "",
        height: existingPlayer.height
          ? existingPlayer.height.toString().replace(".", ",")
          : "",
        join_date: existingPlayer.join_date || "",
        value:
          existingPlayer.value?.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          }) || "",
      });
    }
  }, [existingPlayer]);

  const positionOrder = [
    "GOL",
    "LAT",
    "ZAG",
    "VOL",
    "MEI",
    "PE",
    "PD",
    "SA",
    "ATA",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "height" || name === "weight") {
      const onlyNumbers = value.replace(/[^0-9]/g, "");
      if (!onlyNumbers) {
        formattedValue = "";
      } else {
        const integerPart = onlyNumbers.slice(0, -1) || "0";
        const decimalPart = onlyNumbers.slice(-1);
        formattedValue = `${parseInt(integerPart, 10)},${decimalPart}`;
      }
    }

    setForm((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const parseNumber = (str: string) => Number(str.replace(",", "."));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from("players")
      .update({
        name: form.name,
        age: Number(form.age),
        dob: form.dob,
        position: form.position,
        nationality: form.nationality,
        status: form.status,
        weight: parseNumber(form.weight),
        height: parseNumber(form.height),
        join_date: form.join_date,
        value: parseNumber(form.value),
        teams_id: teamId,
      })
      .eq("id", existingPlayer.id);

    if (error) {
      setError(error.message);
    } else {
      onSubmitSuccess();
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: `Você deseja excluir o jogador ${form.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#1f2937",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      background: "#1f2937",
      color: "#f3f4f6",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", existingPlayer.id);
    setLoading(false);

    if (error) {
      await Swal.fire({
        title: "Erro!",
        text: error.message,
        icon: "error",
        background: "#1f2937",
        color: "#f3f4f6",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    Swal.fire({
      title: "Excluído!",
      text: "Jogador removido com sucesso.",
      icon: "success",
      background: "#1f2937",
      color: "#f3f4f6",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      allowOutsideClick: false,
      customClass: {
        popup: "rounded-lg shadow-lg",
      },
      willClose: () => {
        onSubmitSuccess();
      },
    });
  };

  const renderField = (label: string, name: string, input: JSX.Element) => (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
        {label}
      </label>
      {input}
    </div>
  );

  const baseInputClass =
    "w-full h-[48px] px-3 rounded-md bg-gray-800 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-highlight-green focus:outline-none transition-all duration-300";

  return (
    <>
      {/* Estilo global para deixar ícone do calendário branco */}
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
      `}</style>

      <form onSubmit={handleSubmit} className="space-y-6 text-white">
        {error && (
          <div className="bg-red-600 text-white text-sm px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        {/* Linha 1 */}
        <div className="grid grid-cols-4 gap-4">
          {renderField(
            "Nome",
            "name",
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex: João Silva"
              className={baseInputClass}
            />
          )}
          {renderField(
            "Nacionalidade",
            "nationality",
            <select
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
              className={baseInputClass}
            >
              <option value="">Selecione</option>
              {Object.entries(countries).map(([code, fullName]) => (
                <option key={code} value={code}>
                  {fullName}
                </option>
              ))}
            </select>
          )}
          {renderField(
            "Valor (R$)",
            "value",
            <NumericFormat
              name="value"
              value={form.value}
              onValueChange={(values) =>
                setForm((prev) => ({
                  ...prev,
                  value: values.formattedValue,
                }))
              }
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              placeholder="Ex: 4.700,00"
              className={baseInputClass}
            />
          )}
          {renderField(
            "Posição",
            "position",
            <select
              name="position"
              value={form.position}
              onChange={handleChange}
              className={baseInputClass}
            >
              <option value="">Selecione</option>
              {positionOrder.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Linha 2 */}
        <div className="grid grid-cols-4 gap-4">
          {renderField(
            "Status",
            "status",
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={baseInputClass}
            >
              <option value="ativo">Ativo</option>
              <option value="lesionado">Lesionado</option>
              <option value="nulo">Nulo</option>
            </select>
          )}
          {renderField(
            "Peso (kg)",
            "weight",
            <NumericFormat
              name="weight"
              value={form.weight}
              onValueChange={(values) =>
                setForm((prev) => ({
                  ...prev,
                  weight: values.formattedValue,
                }))
              }
              decimalSeparator=","
              decimalScale={1}
              fixedDecimalScale
              allowNegative={false}
              allowLeadingZeros={false}
              placeholder="Ex: 79,8"
              className={baseInputClass}
            />
          )}
          {renderField(
            "Altura (m)",
            "height",
            <NumericFormat
              name="height"
              value={form.height}
              onValueChange={(values) =>
                setForm((prev) => ({
                  ...prev,
                  height: values.formattedValue,
                }))
              }
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              allowLeadingZeros={false}
              placeholder="Ex: 1,80"
              className={baseInputClass}
            />
          )}
          {renderField(
            "Idade",
            "age",
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Ex: 22"
              className={baseInputClass}
            />
          )}
        </div>

        {/* Linha 3 */}
        <div className="grid grid-cols-2 gap-4">
          {renderField(
            "Nascimento",
            "dob",
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className={baseInputClass}
            />
          )}
          {renderField(
            "Data de Contratação",
            "join_date",
            <input
              type="date"
              name="join_date"
              value={form.join_date}
              onChange={handleChange}
              className={baseInputClass}
            />
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleDelete}
            className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors shadow-md"
            aria-label="Excluir"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6"
              />
            </svg>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-black transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Salvar"
          >
            <Save className="w-5 h-5" />
          </button>
        </div>
      </form>
    </>
  );
}
