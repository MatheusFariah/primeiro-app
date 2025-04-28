"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createClient } from "@supabase/supabase-js";  // Corrigido para importar createClient
import { useRouter } from "next/router";

// Configuração do Supabase diretamente aqui
const SUPABASE_URL = "https://vtosqvwlbojtuidwtmdp.supabase.co"; // Substitua pela sua URL do Supabase
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";  // Substitua pela sua chave pública do Supabase

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);  // Criando a instância do Supabase

interface UpsertTeamsFormProps {
  onSubmitSuccess?: () => void;
  existingTeam?: {
    id?: string;
    name?: string;
    founded?: string;
    city?: string;
  };
}

export default function UpsertTeamsForm({
  onSubmitSuccess,
  existingTeam,
}: UpsertTeamsFormProps) {
  const isEditMode = !!existingTeam?.id;
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: existingTeam?.name || "",
      founded: existingTeam?.founded || "",
      city: existingTeam?.city || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Preencha o campo"),
      founded: Yup.string().required("Preencha o campo"),
      city: Yup.string().required("Preencha o campo"),
    }),
    onSubmit: async (values) => {
      setStatus("Carregando...");

      try {
        if (isEditMode) {
          // Atualizar o time no Supabase
          const { data, error } = await supabase
            .from("teams")
            .update({
              name: values.name,
              founded: parseInt(values.founded),
              city: values.city,
            })
            .eq("id", existingTeam?.id); // Garantir que atualize o time certo

          if (error) throw error;
          setStatus("Time atualizado com sucesso!");
        } else {
          // Adicionar novo time no Supabase
          const { data, error } = await supabase
            .from("teams")
            .insert([
              {
                name: values.name,
                founded: parseInt(values.founded),
                city: values.city,
              },
            ]);

          if (error) throw error;
          setStatus("Time adicionado com sucesso!");
        }

        // Chama a função de sucesso após a operação
        onSubmitSuccess?.();

        // Redireciona de volta para a lista de times
        setTimeout(() => {
          router.push("/teams");
        }, 1500);
      } catch (error: any) {
        console.error("Erro ao adicionar/atualizar time: ", error);
        setStatus("Erro ao adicionar/atualizar time. Tente novamente.");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Nome do Time */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
          Nome do Time
        </label>
        <input
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Ex: FutStat FC"
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

      {/* Fundado em */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
          Fundado em
        </label>
        <input
          type="text"
          name="founded"
          value={formik.values.founded}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Ex: 1990"
          className={`w-full p-3 rounded-md bg-gray-800 text-white border ${
            formik.touched.founded && formik.errors.founded
              ? "border-red-500"
              : "border-white/10"
          } placeholder-gray-500 transition-all duration-300`}
          style={{
            outline: "none",
            boxShadow:
              formik.touched.founded && !formik.errors.founded
                ? "0 0 0 1px var(--highlight-green)"
                : undefined,
          }}
        />
        <div className="absolute left-0 mt-1 text-red-500 text-xs min-h-[1rem]">
          {formik.touched.founded && formik.errors.founded}
        </div>
      </div>

      {/* Cidade */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
          Cidade
        </label>
        <input
          type="text"
          name="city"
          value={formik.values.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Ex: São Paulo"
          className={`w-full p-3 rounded-md bg-gray-800 text-white border ${
            formik.touched.city && formik.errors.city
              ? "border-red-500"
              : "border-white/10"
          } placeholder-gray-500 transition-all duration-300`}
          style={{
            outline: "none",
            boxShadow:
              formik.touched.city && !formik.errors.city
                ? "0 0 0 1px var(--highlight-green)"
                : undefined,
          }}
        />
        <div className="absolute left-0 mt-1 text-red-500 text-xs min-h-[1rem]">
          {formik.touched.city && formik.errors.city}
        </div>
      </div>

      {/* Botão */}
      <button
        type="submit"
        className="w-full py-3 rounded-lg border-2 font-semibold transition-all duration-300"
        style={{
          borderColor: "var(--highlight-green)",
          backgroundColor: "var(--highlight-green)",
          color: "white",
        }}
      >
        {isEditMode ? "Salvar Alterações" : "Cadastrar"}
      </button>

      {/* Status de envio */}
      {status && (
        <div
          className={`mt-4 p-2 rounded text-center ${
            status.includes("sucesso") ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          {status}
        </div>
      )}
    </form>
  );
}
