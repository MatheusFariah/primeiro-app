"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/app/lib/supabaseClient";

interface UpsertPlayersFormProps {
  teamId: number;
  onSubmitSuccess?: () => void;
  existingPlayer?: {
    id?: number;
    name?: string;
    position?: string;
    number?: number;
    goals?: number;
    assists?: number;
  };
}

export default function UpsertPlayersForm({
  teamId,
  onSubmitSuccess,
  existingPlayer,
}: UpsertPlayersFormProps) {
  const isEditMode = !!existingPlayer?.id;

  const formik = useFormik({
    initialValues: {
      name: existingPlayer?.name || "",
      position: existingPlayer?.position || "",
      number: existingPlayer?.number || "",
      goals: existingPlayer?.goals || "",
      assists: existingPlayer?.assists || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Preencha o nome"),
      position: Yup.string().required("Preencha a posição"),
      number: Yup.number().typeError("Número inválido").required("Número obrigatório"),
      goals: Yup.number().min(0).required("Informe os gols"),
      assists: Yup.number().min(0).required("Informe as assistências"),
    }),
    onSubmit: async (values) => {
      const payload = { ...values, teams_id: teamId };
      let error;

      if (isEditMode) {
        ({ error } = await supabase.from("players").update(payload).eq("id", existingPlayer!.id));
      } else {
        ({ error } = await supabase.from("players").insert(payload));
      }

      if (!error) {
        onSubmitSuccess?.();
      } else {
        console.error("Erro ao salvar jogador:", error.message);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <InputField label="Nome" name="name" placeholder="Ex: João Silva" formik={formik} />
      <InputField label="Posição" name="position" placeholder="Ex: Meia" formik={formik} />
      <InputField label="Número" name="number" type="number" placeholder="Ex: 10" formik={formik} />
      <InputField label="Gols" name="goals" type="number" placeholder="Ex: 5" formik={formik} />
      <InputField label="Assistências" name="assists" type="number" placeholder="Ex: 2" formik={formik} />

      <button
        type="submit"
        className="w-full py-3 rounded-lg border-2 font-semibold transition-all duration-300 bg-highlight-green text-black"
      >
        {isEditMode ? "Salvar Alterações" : "Cadastrar Jogador"}
      </button>
    </form>
  );
}

function InputField({ label, name, placeholder, type = "text", formik }: any) {
  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
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
          formik.touched[name] && formik.errors[name] ? "border-red-500" : "border-white/10"
        } placeholder-gray-500 transition-all duration-300`}
      />
      <div className="absolute left-0 mt-1 text-red-500 text-xs min-h-[1rem]">
        {formik.touched[name] && formik.errors[name]}
      </div>
    </div>
  );
}
