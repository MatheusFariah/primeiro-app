// src/app/leagues/components/upsert-leagues-form.tsx
"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Save } from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";

export interface League {
  id?: number;
  name: string;
  location: string;
  created_at?: string;
  ended_at?: string;
}

interface UpsertLeaguesFormProps {
  existingLeague?: League | null;
  onSubmitSuccess: () => void;
}

export default function UpsertLeaguesForm({
  existingLeague = null,
  onSubmitSuccess,
}: UpsertLeaguesFormProps) {
  const initialValues = {
    name: existingLeague?.name ?? "",
    location: existingLeague?.location ?? "",
    created_at: existingLeague?.created_at?.slice(0, 10) ?? "",
    ended_at: existingLeague?.ended_at?.slice(0, 10) ?? "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("O nome é obrigatório."),
    location: Yup.string().required("A localização é obrigatória."),
    created_at: Yup.string().required("Data de início obrigatória."),
    ended_at: Yup.string()
      .nullable()
      .notRequired()
      .test(
        "valid-end",
        "Data de término deve ser posterior à de início.",
        function (value) {
          if (!value || !this.parent.created_at) return true;
          return value >= this.parent.created_at;
        }
      ),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>
  ) => {
    helpers.setSubmitting(true);
    helpers.setStatus(null);

    const payload = {
      name: values.name,
      location: values.location,
      created_at: values.created_at,
      ended_at: values.ended_at || null,
    };

    try {
      if (existingLeague && existingLeague.id) {
        const { error } = await supabase
          .from("leagues")
          .update(payload)
          .eq("id", existingLeague.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("leagues").insert(payload);
        if (error) throw error;
      }
      onSubmitSuccess();
    } catch (err: any) {
      helpers.setStatus(err.message || "Ocorreu um erro inesperado.");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const baseInputClass =
    "w-full h-[48px] px-3 rounded-md bg-gray-800 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-highlight-green focus:outline-none transition-all duration-300";

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, status }) => (
        <Form className="space-y-6 text-white">
          {status && (
            <div className="bg-red-600 text-white text-sm px-4 py-2 rounded-md">
              {status}
            </div>
          )}

          {/* Nome da Liga */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
              Nome da Liga
            </label>
            <Field
              type="text"
              name="name"
              placeholder="Ex: Campeonato Brasileiro"
              className={baseInputClass}
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Localização */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
              Localização
            </label>
            <Field
              type="text"
              name="location"
              placeholder="Ex: Brasil"
              className={baseInputClass}
            />
            <ErrorMessage
              name="location"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                Início
              </label>
              <Field type="date" name="created_at" className={baseInputClass} />
              <ErrorMessage
                name="created_at"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
                Fim
              </label>
              <Field type="date" name="ended_at" className={baseInputClass} />
              <ErrorMessage
                name="ended_at"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          {/* Botão de Salvar */}
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
  );
}
