"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface UpsertTeamsFormProps {
  existingTeam?: {
    id: number;
    name: string;
    coach: string;
    value: number;
    founded: number;
  };
  onSubmitSuccess?: () => void;
}

type FormField = "name" | "coach" | "value" | "founded";

export default function UpsertTeamsForm({
  existingTeam,
  onSubmitSuccess,
}: UpsertTeamsFormProps) {
  const isEdit = Boolean(existingTeam?.id);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: existingTeam?.name ?? "",
      coach: existingTeam?.coach ?? "",
      value: existingTeam?.value?.toString() ?? "",
      founded: existingTeam?.founded?.toString() ?? "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Preencha o campo"),
      coach: Yup.string().required("Preencha o campo"),
      value: Yup.string().required("Preencha o campo"),
      founded: Yup.string().required("Preencha o campo"),
    }),
    onSubmit: async (values) => {
      setStatus("Carregando...");
      try {
        let res;
        if (isEdit && existingTeam) {
          res = await supabase
            .from("teams")
            .update({
              name: values.name,
              coach: values.coach,
              value: Number(values.value),
              founded: Number(values.founded),
            })
            .eq("id", existingTeam.id);
        } else {
          res = await supabase.from("teams").insert([
            {
              name: values.name,
              coach: values.coach,
              value: Number(values.value),
              founded: Number(values.founded),
            },
          ]);
        }
        if (res.error) throw res.error;
        setStatus(isEdit ? "Time atualizado!" : "Time cadastrado!");
        onSubmitSuccess?.();
        setTimeout(() => router.refresh(), 300);
      } catch (err: any) {
        console.error(err);
        setStatus("Erro, tente novamente.");
      }
    },
  });

  const fieldClasses = (field: FormField) =>
    `w-full p-3 rounded-md bg-gray-800 text-white border` +
    (formik.touched[field] && formik.errors[field]
      ? " border-red-500"
      : " border-gray-700");

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Nome do Time */}
      <div className="relative mb-8">
        <label className="block text-sm font-semibold text-gray-300 mb-2">Nome do Time</label>
        <input
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Ex: FutStat FC"
          className={fieldClasses("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="absolute left-0 top-full mt-1 text-xs text-red-400">{formik.errors.name}</span>
        )}
      </div>

      {/* Técnico */}
      <div className="relative mb-8">
        <label className="block text-sm font-semibold text-gray-300 mb-2">Técnico</label>
        <input
          name="coach"
          value={formik.values.coach}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Ex: José Silva"
          className={fieldClasses("coach")}
        />
        {formik.touched.coach && formik.errors.coach && (
          <span className="absolute left-0 top-full mt-1 text-xs text-red-400">{formik.errors.coach}</span>
        )}
      </div>

      {/* Valor */}
      <div className="relative mb-8">
        <label className="block text-sm font-semibold text-gray-300 mb-2">Valor</label>
        <input
          name="value"
          value={formik.values.value}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Ex: 1200000"
          className={fieldClasses("value")}
        />
        {formik.touched.value && formik.errors.value && (
          <span className="absolute left-0 top-full mt-1 text-xs text-red-400">{formik.errors.value}</span>
        )}
      </div>

      {/* Ano de Fundação */}
      <div className="relative mb-8">
        <label className="block text-sm font-semibold text-gray-300 mb-2">Ano de Fundação</label>
        <input
          name="founded"
          value={formik.values.founded}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Ex: 1970"
          className={fieldClasses("founded")}
        />
        {formik.touched.founded && formik.errors.founded && (
          <span className="absolute left-0 top-full mt-1 text-xs text-red-400">{formik.errors.founded}</span>
        )}
      </div>

      {/* Botão de Submit */}
      <button
        type="submit"
        className="w-full py-3 rounded-lg border-2 font-semibold transition-colors duration-300 hover:bg-[#00722c] hover:border-[#00722c]"
        style={{
          borderColor: "#00722c",
          backgroundColor: "#00722c",
          color: "#fff",
        }}
      >
        {isEdit ? "Salvar Alterações" : "Cadastrar Time"}
      </button>

      {/* Feedback */}
      {status && (
        <div
          className={`mt-4 p-2 rounded text-center ${status.includes('Erro') ? "bg-red-600" : "bg-green-600"} text-white`}
        >
          {status}
        </div>
      )}
    </form>
  );
}