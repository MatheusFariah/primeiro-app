// app/teams/add/page.tsx
"use client";

import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import UpsertTeamsForm from "../teams/components/upsert-teams-form";
import { useRouter } from "next/router";

const AddTeamPage: React.FC = () => {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-900">
        <h2 className="text-4xl font-bold text-white mb-4">Adicionar Novo Time</h2>
        <button
          onClick={() => router.push("/teams")}
          className="text-sm text-gray-400 hover:text-gray-200 mb-6"
        >
          ← Voltar para a lista de times
        </button>

        {status && (
          <div
            className={`mb-6 p-3 rounded text-center ${
              status.includes("sucesso")
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {status}
          </div>
        )}

        <UpsertTeamsForm
          onSubmitSuccess={() => {
            setStatus("Time adicionado com sucesso!");
            setTimeout(() => {
              router.push("/teams");
            }, 1500);
          }}
        />
      </div>
    </div>
  );
};

export default AddTeamPage;
