"use client";

import { JSX, useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { countries } from "@/app/utils/countries";
import { Save } from "lucide-react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

interface Player {
  id: number;
  name: string;
  age: number;
  dob: string;
  position: string;
  nationality: string;
  status: string;
  weight: number;
  height: number;
  join_date: string;
  value: number;
  teams_id: number;
}

interface EditPlayersFormProps {
  teamId: number;
  existingPlayer?: Player | null;
  onSubmitSuccess: () => void;
}

interface FormValues {
  name: string;
  age: string;
  dob: string;
  position: string;
  nationality: string;
  status: string;
  weight: string;
  height: string;
  join_date: string;
  value: string;
}

export default function EditPlayersForm({
  teamId,
  existingPlayer = null,
  onSubmitSuccess,
}: EditPlayersFormProps) {
  const positionOrder = [
    "GOL",
    "LAT",
    "ZAG",
    "VOL",
    "MEI",
    "PE",
    "PD",
    "SA",
    "ATA",
  ];

  const initialValues: FormValues = {
    name: existingPlayer?.name?.toString() ?? "",
    age: existingPlayer?.age?.toString() ?? "",
    dob: existingPlayer?.dob ?? "",
    position: existingPlayer?.position ?? "",
    nationality: existingPlayer?.nationality ?? "BR",
    status: existingPlayer?.status ?? "ativo",
    weight: existingPlayer?.weight?.toString() ?? "",
    height: existingPlayer?.height?.toString() ?? "",
    join_date: existingPlayer?.join_date ?? "",
    value: existingPlayer?.value?.toString() ?? "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("O nome é obrigatório."),
    age: Yup.number()
      .typeError("Idade deve ser um número.")
      .required("A idade é obrigatória.")
      .integer("Idade deve ser um número inteiro.")
      .min(17, "A idade deve ser maior que 16."),
    dob: Yup.string().required("Data de nascimento é obrigatória."),
    position: Yup.string().required("A posição é obrigatória."),
    nationality: Yup.string().required("A nacionalidade é obrigatória."),
    status: Yup.string().required("O status é obrigatório."),
    weight: Yup.number()
      .typeError("Peso deve ser um número.")
      .required("O peso é obrigatório.")
      .positive("Peso deve ser positivo."),
    height: Yup.number()
      .typeError("Altura deve ser um número.")
      .required("A altura é obrigatória.")
      .positive("Altura deve ser positiva."),
    join_date: Yup.string().required("Data de contratação é obrigatória."),
    value: Yup.number()
      .typeError("Valor deve ser um número.")
      .required("O valor é obrigatório.")
      .positive("Valor deve ser positivo."),
  });

  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    formikHelpers.setSubmitting(true);
    formikHelpers.setStatus(null);

    const payload = {
      name: values.name,
      age: Number(values.age),
      dob: values.dob,
      position: values.position,
      nationality: values.nationality,
      status: values.status,
      weight: Number(values.weight),
      height: Number(values.height),
      join_date: values.join_date,
      value: Number(values.value),
      teams_id: teamId,
    };

    try {
      if (existingPlayer && existingPlayer.id) {
        const { error: updateError } = await supabase
          .from("players")
          .update(payload)
          .eq("id", existingPlayer.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        const { error: insertError } = await supabase
          .from("players")
          .insert(payload);

        if (insertError) {
          throw insertError;
        }
      }

      onSubmitSuccess();
    } catch (err: any) {
      formikHelpers.setStatus(err.message || "Ocorreu um erro inesperado.");
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  const baseInputClass =
    "w-full h-[48px] px-3 rounded-md bg-gray-800 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-highlight-green focus:outline-none transition-all duration-300";

  return (
    <>
      {/* Estilo global para deixar ícone do calendário branco */}
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
      `}</style>

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-6 text-white">
            {status && (
              <div className="bg-red-600 text-white text-sm px-4 py-2 rounded-md">
                {status}
              </div>
            )}

            {/* Linha 1 */}
            <div className="grid grid-cols-4 gap-4">
              {/* Nome */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Nome
                </label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Ex: João Silva"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Nacionalidade */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Nacionalidade
                </label>
                <Field
                  as="select"
                  name="nationality"
                  className={baseInputClass}
                >
                  <option value="">Selecione</option>
                  {Object.entries(countries).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="nationality"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Valor (R$) */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Valor (R$)
                </label>
                <Field
                  type="number"
                  name="value"
                  placeholder="0.00"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="value"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Posição */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Posição
                </label>
                <Field as="select" name="position" className={baseInputClass}>
                  <option value="">Selecione</option>
                  {positionOrder.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="position"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-4 gap-4">
              {/* Status */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Status
                </label>
                <Field as="select" name="status" className={baseInputClass}>
                  <option value="">Selecione</option>
                  <option value="ativo">Ativo</option>
                  <option value="lesionado">Lesionado</option>
                  <option value="nulo">Nulo</option>
                </Field>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Peso (kg) */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Peso (kg)
                </label>
                <Field
                  type="number"
                  name="weight"
                  placeholder="Ex: 70"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="weight"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Altura (cm) */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Altura (cm)
                </label>
                <Field
                  type="number"
                  name="height"
                  placeholder="Ex: 180"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="height"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Idade */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Idade
                </label>
                <Field
                  type="number"
                  name="age"
                  placeholder="Ex: 22"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="age"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            {/* Linha 3 */}
            <div className="grid grid-cols-2 gap-4">
              {/* Data de Nascimento */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Nascimento
                </label>
                <Field type="date" name="dob" className={baseInputClass} />
                <ErrorMessage
                  name="dob"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Data de Contratação */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                  Data de Contratação
                </label>
                <Field
                  type="date"
                  name="join_date"
                  className={baseInputClass}
                />
                <ErrorMessage
                  name="join_date"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            {/* Botão de salvar */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-highlight-green text-highlight-green hover:bg-highlight-green hover:text-black transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Salvar"
              >
                <Save className="w-5 h-5" />
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
