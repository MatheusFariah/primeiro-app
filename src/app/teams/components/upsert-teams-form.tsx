"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Save } from "lucide-react";

interface UpsertTeamsFormProps {
  initialData?: {
    id?: number;
    name: string;
    coach: string;
    founded: number;
  };
  onSubmit: (data: {
    name: string;
    coach: string;
    founded: number;
  }) => void;
}

type FormField = "name" | "coach" | "founded";

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
      founded: initialData?.founded?.toString() ?? "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Preencha o nome do time"),
      coach: Yup.string().required("Preencha o nome do técnico"),
      founded: Yup.number()
        .typeError("Digite um ano válido")
        .required("Preencha o ano de fundação"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await onSubmit({
          name: values.name,
          coach: values.coach,
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
      {(["name", "coach", "founded"] as FormField[]).map((field) => (
        <div className="relative mb-8" key={field}>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            {{
              name: "Nome do Time",
              coach: "Técnico",
              founded: "Ano de Fundação",
            }[field]}
          </label>
          <input
            name={field}
            value={formik.values[field]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder=""
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
