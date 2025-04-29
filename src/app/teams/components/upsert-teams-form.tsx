'use client';

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

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
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      try {
        const payload = {
          name: values.name,
          coach: values.coach,
          value: Number(values.value),
          founded: Number(values.founded),
        };

        let res;

        if (isEdit && existingTeam) {
          setStatusMessage("Edição ainda não implementada.");
          setStatusType("error");
          return;
        } else {
          res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Erro ao salvar o time.");
        }

        setStatusMessage("Time cadastrado com sucesso!");
        setStatusType("success");

        formik.resetForm();
        onSubmitSuccess?.();
      } catch (err: any) {
        console.error(err);
        setStatusMessage(err.message || "Erro ao cadastrar.");
        setStatusType("error");
      } finally {
        setIsLoading(false);

        setTimeout(() => {
          setStatusMessage(null);
          setStatusType(null);
        }, 3000);
      }
    },
  });

  const fieldClasses = (field: FormField) =>
    `w-full p-3 rounded-md bg-gray-800 text-white border transition-colors duration-300` +
    (formik.touched[field] && formik.errors[field]
      ? " border-red-500"
      : " border-gray-700 focus:border-highlight-green focus:ring-1 focus:ring-highlight-green");

  return (
    <div className="relative">
      {statusMessage && (
        <div className={`absolute top-[-80px] left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-2xl shadow-lg text-center font-bold text-lg animate-slide-up transition-all duration-500
          ${statusType === "success" ? "bg-highlight-green text-white" : "bg-red-600 text-white"}
        `}>
          {statusMessage}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Nome */}
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

        {/* Fundação */}
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

        {/* Botão */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-full border-2 font-bold text-lg transition-all duration-300
            bg-highlight-green border-highlight-green text-white 
            hover:scale-105 hover:brightness-110
            disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Salvando...</span>
            </div>
          ) : (
            isEdit ? "Salvar Alterações" : "Cadastrar Time"
          )}
        </button>
      </form>
    </div>
  );
}
