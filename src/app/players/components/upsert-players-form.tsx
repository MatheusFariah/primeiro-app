"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/app/lib/supabaseClient";
import { countries } from "@/app/utils/countries";
import { Save } from "lucide-react";

interface UpsertPlayersFormProps {
  teamId: number;
  onSubmitSuccess?: () => void;
  existingPlayer?: any;
}

interface PlayerFormValues {
  name: string;
  age: number | string;
  dob: string;
  position: string;
  nationality: string;
  status: string;
  weight: number | string;
  height: number | string;
  join_date: string;
  value: number | string;
}

const formatCurrency = (value: string): string => {
  const onlyNums = value.replace(/\D/g, "");
  const number = Number(onlyNums) / 100;
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const parseFormattedNumber = (formatted: string): number =>
  Number(formatted.replace(/\./g, "").replace(",", "."));

export default function UpsertPlayersForm({
  teamId,
  onSubmitSuccess,
  existingPlayer,
}: UpsertPlayersFormProps) {
  const isEditMode = !!existingPlayer?.id;

  const formik = useFormik<PlayerFormValues>({
    initialValues: {
      name: existingPlayer?.name || "",
      age: existingPlayer?.age || "",
      dob: existingPlayer?.dob || "",
      position: existingPlayer?.position || "",
      nationality: existingPlayer?.nationality || "",
      status: existingPlayer?.status || "",
      weight: existingPlayer?.weight || "",
      height: existingPlayer?.height || "",
      join_date: existingPlayer?.join_date || "",
      value: existingPlayer?.value || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Preencha o nome"),
      age: Yup.number().min(0).required("Informe a idade"),
      dob: Yup.date().required("Informe a data de nascimento"),
      position: Yup.string().required("Preencha a posição"),
      nationality: Yup.string().required("Informe a nacionalidade"),
      status: Yup.string().required("Informe o status"),
      weight: Yup.number().required("Informe o peso"),
      height: Yup.number().required("Informe a altura"),
      join_date: Yup.date().required("Informe a data de contratação"),
      value: Yup.number().required("Informe o valor"),
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
        teams_id: teamId,
        value: parseFormattedNumber(values.value.toString()),
        weight: parseFormattedNumber(values.weight.toString()),
        height: parseFormattedNumber(values.height.toString()),
      };

      const { error } = isEditMode
        ? await supabase
            .from("players")
            .update(payload)
            .eq("id", existingPlayer!.id)
        : await supabase.from("players").insert(payload);

      if (!error) onSubmitSuccess?.();
      else console.error("Erro ao salvar jogador:", error.message);
    },
  });

  const renderInput = (
    name: keyof PlayerFormValues,
    label: string,
    type: string,
    placeholder?: string
  ) => (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full h-[48px] px-3 rounded-md bg-gray-800 text-white text-base font-medium border ${
          formik.touched[name] && formik.errors[name]
            ? "border-red-500"
            : "border-white/10"
        } placeholder-gray-500 transition-all duration-300`}
      />
      <div className="text-red-500 text-xs mt-1 min-h-[1rem]">
        {formik.touched[name] && formik.errors[name]}
      </div>
    </div>
  );

  const renderFormattedInput = (
    name: keyof PlayerFormValues,
    label: string,
    placeholder?: string
  ) => (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
        {label}
      </label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={formik.values[name].toString()}
        onChange={(e) => {
          const formatted = formatCurrency(e.target.value);
          formik.setFieldValue(name, formatted);
        }}
        onBlur={() => {
          const parsed = parseFormattedNumber(formik.values[name].toString());
          formik.setFieldValue(name, parsed);
        }}
        className={`w-full h-[48px] px-3 rounded-md bg-gray-800 text-white text-base font-medium border ${
          formik.touched[name] && formik.errors[name]
            ? "border-red-500"
            : "border-white/10"
        } placeholder-gray-500 transition-all duration-300`}
      />
      <div className="text-red-500 text-xs mt-1 min-h-[1rem]">
        {formik.touched[name] && formik.errors[name]}
      </div>
    </div>
  );

  const renderSelect = (
    name: keyof PlayerFormValues,
    label: string,
    options: { label: string; value: string }[]
  ) => (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
        {label}
      </label>
      <select
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full h-[48px] px-3 rounded-md bg-gray-800 text-white text-base font-medium border ${
          formik.touched[name] && formik.errors[name]
            ? "border-red-500"
            : "border-white/10"
        } appearance-none focus:outline-none transition-all duration-300`}
      >
        <option value="">Selecione</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="text-red-500 text-xs mt-1 min-h-[1rem]">
        {formik.touched[name] && formik.errors[name]}
      </div>
    </div>
  );

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 overflow-hidden">
      {/* Linha 1 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          {renderInput("name", "Nome", "text", "Ex: João Silva")}
        </div>
        <div className="col-span-1">
          {renderSelect(
            "nationality",
            "Nacionalidade",
            Object.entries(countries).map(([name, code]) => ({
              label: name,
              value: code,
            }))
          )}
        </div>
        <div className="col-span-1">
          {renderFormattedInput("value", "Valor", "R$")}
        </div>
      </div>

      {/* Linha 2 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          {renderSelect(
            "position",
            "Posição",
            [
              "GK",
              "ZAG",
              "LD",
              "LE",
              "VOL",
              "MC",
              "MD",
              "ME",
              "MEI",
              "PE",
              "PD",
              "SA",
              "ATA",
            ].map((v) => ({ label: v, value: v }))
          )}
        </div>
        <div className="col-span-1">
          {renderSelect("status", "Status", [
            { label: "Ativo", value: "Ativo" },
            { label: "Nulo", value: "Nulo" },
            { label: "Lesionado", value: "Lesionado" },
          ])}
        </div>
        <div className="col-span-1">
          {renderFormattedInput("weight", "Peso (kg)")}
        </div>
      </div>

      {/* Linha 3 */}
      <div className="grid grid-cols-4 gap-4">
        {renderInput("dob", "Nascimento", "date")}
        {renderInput("join_date", "Data de Contratação", "date")}
        {renderInput("age", "Idade", "number", "Ex: 22")}
        {renderFormattedInput("height", "Altura (m)")}
      </div>

      {/* Botão de salvar */}
      <div className="flex justify-end gap-3">
        {/* Botão de salvar */}
        <button
          type="submit"
          form="upsert-player-form"
          className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-black transition-colors shadow-md"
          aria-label="Salvar"
        >
          <Save className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}

function InputField({ label, name, placeholder, type = "text", formik }: any) {
  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        className={`w-full p-3 rounded-md bg-gray-800 text-white border ${
          formik.touched[name] && formik.errors[name]
            ? "border-red-500"
            : "border-white/10"
        } placeholder-gray-500 transition-all duration-300`}
      />
      <div className="absolute left-0 mt-1 text-red-500 text-xs min-h-[1rem]">
        {formik.touched[name] && formik.errors[name]}
      </div>
    </div>
  );
}

function CountrySelectField({ formik }: { formik: any }) {
  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
        Nacionalidade
      </label>
      <select
        name="nationality"
        value={formik.values.nationality}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full p-3 rounded-md bg-gray-800 text-white border ${
          formik.touched.nationality && formik.errors.nationality
            ? "border-red-500"
            : "border-white/10"
        } transition-all duration-300`}
      >
        <option value="">Selecione um país</option>
        {Object.entries(countries).map(([countryName, countryCode]) => (
          <option key={countryCode} value={countryCode}>
            {countryName}
          </option>
        ))}
      </select>

      {Object.keys(countries).includes(formik.values.nationality) && (
        <div className="mt-2 flex items-center gap-2 text-sm text-white">
          <img
            src={`https://flagcdn.com/w40/${formik.values.nationality.toLowerCase()}.png`}
            className="w-6 h-4 object-cover rounded-sm border border-white/20"
            alt="bandeira"
          />
          {countries[formik.values.nationality]} {/* Mostra o nome do país */}
        </div>
      )}

      <div className="absolute left-0 mt-1 text-red-500 text-xs min-h-[1rem]">
        {formik.touched.nationality && formik.errors.nationality}
      </div>
    </div>
  );
}
