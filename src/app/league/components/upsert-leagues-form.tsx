"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface UpsertLeaguesFormProps {
  onSubmitSuccess?: () => void;
  existingLeague?: {
    id?: string;
    name?: string;
    teamsCount?: number;
    matches?: number;
  };
}

export default function UpsertLeaguesForm({
  onSubmitSuccess,
  existingLeague,
}: UpsertLeaguesFormProps) {
  const isEditMode = !!existingLeague?.id;

  const formik = useFormik({
    initialValues: {
      name: existingLeague?.name || "",
      teamsCount: existingLeague?.teamsCount || "",
      matches: existingLeague?.matches || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Preencha o campo"),
      teamsCount: Yup.number()
        .typeError("Informe um número")
        .positive("Deve ser positivo")
        .required("Preencha o campo"),
      matches: Yup.number()
        .typeError("Informe um número")
        .positive("Deve ser positivo")
        .required("Preencha o campo"),
    }),
    onSubmit: (values) => {
      console.log(values);
      onSubmitSuccess?.();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Nome da Liga */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
          Nome da Liga
        </label>
        <input
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Ex: Premier League"
          className={`w-full p-3 rounded-md bg-gray-800 text-white border ${
            formik.touched.name && formik.errors.name
              ? "border-red-500"
              : "border-white/10"
          } placeholder-gray-500 transition-all duration-300`}
          style={{
            outline: "none",
            boxShadow:
              formik.touched.name && !formik.errors.name
                ? "0 0 0 1px var(--highlight-green)"
                : undefined,
          }}
        />
        <div className="absolute left-0 mt-1 text-red-500 text-xs min-h-[1rem]">
          {formik.touched.name && formik.errors.name}
        </div>
      </div>

      {/* Quantidade de Times */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
          Quantidade de Times
        </label>
        <input
          type="number"
          name="teamsCount"
          value={formik.values.teamsCount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Ex: 20"
          className={`w-full p-3 rounded-md bg-gray-800 text-white border ${
            formik.touched.teamsCount && formik.errors.teamsCount
              ? "border-red-500"
              : "border-white/10"
          } placeholder-gray-500 transition-all duration-300`}
          style={{
            outline: "none",
            boxShadow:
              formik.touched.teamsCount && !formik.errors.teamsCount
                ? "0 0 0 1px var(--highlight-green)"
                : undefined,
          }}
        />
        <div className="absolute left-0 mt-1 text-red-500 text-xs min-h-[1rem]">
          {formik.touched.teamsCount && formik.errors.teamsCount}
        </div>
      </div>

      {/* Quantidade de Partidas */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
          Quantidade de Partidas
        </label>
        <input
          type="number"
          name="matches"
          value={formik.values.matches}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Ex: 38"
          className={`w-full p-3 rounded-md bg-gray-800 text-white border ${
            formik.touched.matches && formik.errors.matches
              ? "border-red-500"
              : "border-white/10"
          } placeholder-gray-500 transition-all duration-300`}
          style={{
            outline: "none",
            boxShadow:
              formik.touched.matches && !formik.errors.matches
                ? "0 0 0 1px var(--highlight-green)"
                : undefined,
          }}
        />
        <div className="absolute left-0 mt-1 text-red-500 text-xs min-h-[1rem]">
          {formik.touched.matches && formik.errors.matches}
        </div>
      </div>

      {/* Botão */}
      <button
        type="submit"
        className="
          w-full py-3 
          rounded-lg border-2 
          font-semibold transition-all duration-300
        "
        style={{
          borderColor: "var(--highlight-green)",
          backgroundColor: "var(--highlight-green)",
          color: "white",
        }}
      >
        {isEditMode ? "Salvar Alterações" : "Cadastrar"}
      </button>
    </form>
  );
}
