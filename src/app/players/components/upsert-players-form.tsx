"use client";

import { useFormik } from "formik";
import * as Yup from "yup";

interface UpsertPlayersFormProps {
  teamId: string; // Pra vincular o jogador ao time
  onSubmitSuccess?: () => void;
  existingPlayer?: {
    id?: string;
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
      number: Yup.number()
        .typeError("Informe um número")
        .required("Informe o número"),
      goals: Yup.number()
        .typeError("Informe um número")
        .min(0, "Não pode ser negativo")
        .required("Informe os gols"),
      assists: Yup.number()
        .typeError("Informe um número")
        .min(0, "Não pode ser negativo")
        .required("Informe as assistências"),
    }),
    onSubmit: (values) => {
      console.log({ ...values, teamId }); // Aqui futuramente manda pro backend
      onSubmitSuccess?.();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Nome */}
      <InputField
        label="Nome"
        name="name"
        placeholder="Ex: João Silva"
        formik={formik}
      />

      {/* Posição */}
      <InputField
        label="Posição"
        name="position"
        placeholder="Ex: Atacante"
        formik={formik}
      />

      {/* Número */}
      <InputField
        label="Número"
        name="number"
        type="number"
        placeholder="Ex: 10"
        formik={formik}
      />

      {/* Gols */}
      <InputField
        label="Gols"
        name="goals"
        type="number"
        placeholder="Ex: 5"
        formik={formik}
      />

      {/* Assistências */}
      <InputField
        label="Assistências"
        name="assists"
        type="number"
        placeholder="Ex: 3"
        formik={formik}
      />

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
        {isEditMode ? "Salvar Alterações" : "Cadastrar Jogador"}
      </button>
    </form>
  );
}

// Componente de input padronizado
function InputField({
  label,
  name,
  placeholder,
  type = "text",
  formik,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  formik: any;
}) {
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
          formik.touched[name] && formik.errors[name]
            ? "border-red-500"
            : "border-white/10"
        } placeholder-gray-500 transition-all duration-300`}
        style={{
          outline: "none",
          boxShadow:
            formik.touched[name] && !formik.errors[name]
              ? "0 0 0 1px var(--highlight-green)"
              : undefined,
        }}
      />
      <div className="absolute left-0 mt-1 text-red-500 text-xs min-h-[1rem]">
        {formik.touched[name] && formik.errors[name]}
      </div>
    </div>
  );
}
