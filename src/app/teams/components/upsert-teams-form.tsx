"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Save } from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";

// Tipagem dos valores do form
type TeamFormValues = {
  name: string;
  coach: string;
  founded: string;
  leagues_id: string;
};

interface League {
  id: number;
  name: string;
}

interface UpsertTeamsFormProps {
  initialData?: {
    id?: number;
    name: string;
    coach: string;
    founded: number | string;
    leagues_id?: number | string | null;
  };
  onSubmit: (data: {
    name: string;
    coach: string;
    founded: number;
    leagues_id: number | null;
  }) => void;
}

type FormField = "name" | "coach" | "founded" | "leagues_id";

// Labels centralizados (agora fora do JSX)
const labels: Record<FormField, string> = {
  name: "Nome do Time",
  coach: "Técnico",
  founded: "Ano de Fundação",
  leagues_id: "Liga (máx. 20 times)",
};

export default function UpsertTeamsForm({
  initialData,
  onSubmit,
}: UpsertTeamsFormProps) {
  const isEdit = Boolean(initialData?.id);
  const [isLoading, setIsLoading] = useState(false);

  const [leagues, setLeagues] = useState<League[]>([]);
  const [teamsPerLeague, setTeamsPerLeague] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchLeaguesAndCounts = async () => {
      const { data: leaguesData } = await supabase.from("leagues").select("id, name");
      const { data: teamsData } = await supabase.from("teams").select("leagues_id");
      const countMap: Record<number, number> = {};
      (teamsData || []).forEach(t => {
        if (t.leagues_id) countMap[t.leagues_id] = (countMap[t.leagues_id] || 0) + 1;
      });
      setLeagues(leaguesData || []);
      setTeamsPerLeague(countMap);
    };
    fetchLeaguesAndCounts();
  }, []);

  const formik = useFormik<TeamFormValues>({
    initialValues: {
      name: initialData?.name ?? "",
      coach: initialData?.coach ?? "",
      founded: initialData?.founded?.toString() ?? "",
      leagues_id: initialData?.leagues_id?.toString() ?? "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Preencha o nome do time"),
      coach: Yup.string().required("Preencha o nome do técnico"),
      founded: Yup.number()
        .typeError("Digite um ano válido")
        .required("Preencha o ano de fundação"),
      leagues_id: Yup.string().required("Selecione uma liga"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await onSubmit({
          name: values.name,
          coach: values.coach,
          founded: Number(values.founded),
          leagues_id: values.leagues_id ? Number(values.leagues_id) : null,
        });
        formik.resetForm();
      } finally {
        setIsLoading(false);
      }
    },
  });

  const fieldClasses = (field: FormField) =>
    `w-full p-3 rounded-md bg-gray-800 text-white border transition-colors duration-300` +
    (formik.touched[field] && (formik.errors as any)[field]
      ? " border-red-500"
      : " border-gray-700 focus:border-highlight-green focus:ring-1 focus:ring-highlight-green");

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Campos de texto */}
      {(["name", "coach", "founded"] as FormField[]).map((field) => (
        <div className="relative mb-8" key={field}>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            {labels[field]}
          </label>
          <input
            name={field}
            value={formik.values[field] as string}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder=""
            className={fieldClasses(field)}
            type={field === "founded" ? "number" : "text"}
          />
          {formik.touched[field] && (formik.errors as any)[field] && (
            <span className="absolute left-0 top-full mt-1 text-xs text-red-400">
              {(formik.errors as any)[field]}
            </span>
          )}
        </div>
      ))}

      {/* Select da Liga */}
      <div className="relative mb-8">
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          {labels["leagues_id"]}
        </label>
        <select
          name="leagues_id"
          value={formik.values.leagues_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={fieldClasses("leagues_id")}
        >
          <option value="">Selecione</option>
          {leagues.map(l =>
            <option
              key={l.id}
              value={l.id}
              disabled={
                teamsPerLeague[l.id] >= 20 &&
                (!isEdit || Number(formik.values.leagues_id) !== l.id)
              }
            >
              {l.name} {teamsPerLeague[l.id] >= 20 && (!isEdit || Number(formik.values.leagues_id) !== l.id) ? " (Lotada)" : ""}
            </option>
          )}
        </select>
        {formik.touched.leagues_id && formik.errors.leagues_id && (
          <span className="absolute left-0 top-full mt-1 text-xs text-red-400">
            {formik.errors.leagues_id}
          </span>
        )}
      </div>

      {/* Botão de salvar */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300
    border-highlight-green text-highlight-green 
    hover:bg-highlight-green hover:text-black shadow-md
    disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Salvar Time"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-highlight-green border-t-transparent rounded-full animate-spin" />
        ) : (
          <Save className="w-5 h-5" />
        )}
      </button>
    </form>
  );
}
