"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface UpsertTeamsFormProps {
  initialData?: {
    id?: number;
    name: string;
    coach: string;
    value: number;
    founded: number;
  };
  onSubmit: (data: {
    name: string;
    coach: string;
    value: number;
    founded: number;
  }) => void;
}

type FormField = "name" | "coach" | "value" | "founded";

export default function UpsertTeamsForm({
  initialData,
  onSubmit,
}: UpsertTeamsFormProps) {
  const isEdit = Boolean(initialData?.id);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: initialData?.name ?? "",
      coach: initialData?.coach ?? "",
      value: initialData?.value?.toString() ?? "",
      founded: initialData?.founded?.toString() ?? "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Preencha o campo"),
      coach: Yup.string().required("Preencha o campo"),
      value: Yup.string().required("Preencha o campo"),
      founded: Yup.string().required("Preencha o campo"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await onSubmit({
          name: values.name,
          coach: values.coach,
          value: Number(values.value),
          founded: Number(values.founded),
        });
        formik.resetForm();
      } finally {
        setIsLoading(false);
      }
    },
  });

  const fieldClasses = (field: FormField) =>
    `w-full p-3 rounded-md bg-gray-800 text-white border transition-colors duration-300` +
    (formik.touched[field] && formik.errors[field]
      ? " border-red-500"
      : " border-gray-700 focus:border-highlight-green focus:ring-1 focus:ring-highlight-green");

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {(["name", "coach", "value", "founded"] as FormField[]).map((field) => (
        <div className="relative mb-8" key={field}>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            {{
              name: "Nome do Time",
              coach: "Técnico",
              value: "Valor",
              founded: "Ano de Fundação",
            }[field]}
          </label>
          <input
            name={field}
            value={formik.values[field]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={{
              name: "Ex: FutStat FC",
              coach: "Ex: José Silva",
              value: "Ex: 1200000",
              founded: "Ex: 1970",
            }[field]}
            className={fieldClasses(field)}
          />
          {formik.touched[field] && formik.errors[field] && (
            <span className="absolute left-0 top-full mt-1 text-xs text-red-400">
              {formik.errors[field]}
            </span>
          )}
        </div>
      ))}

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
        ) : isEdit ? "Salvar Alterações" : "Cadastrar Time"}
      </button>
    </form>
  );
}
