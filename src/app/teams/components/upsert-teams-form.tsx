"use client";

import React, { useState } from "react";

interface UpsertTeamsFormProps {
  onSubmitSuccess?: () => void;
  existingTeam?: { id?: string; name?: string; founded?: string; city?: string };
}

export default function UpsertTeamsForm({
  onSubmitSuccess,
  existingTeam,
}: UpsertTeamsFormProps) {
  const [name, setName] = useState(existingTeam?.name || "");
  const [founded, setFounded] = useState(existingTeam?.founded || "");
  const [city, setCity] = useState(existingTeam?.city || "");
  const isEditMode = !!existingTeam?.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // sua chamada de API aqui...
    onSubmitSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-white text-sm mb-1">Nome do Time</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ex: FutStat FC"
          className="
            w-full bg-gray-700 text-white 
            p-3 rounded-lg border border-gray-600 
            focus:outline-none focus:ring-2 focus:ring-green-500
          "
        />
      </div>
      <div>
        <label className="block text-white text-sm mb-1">Fundado em</label>
        <input
          type="text"
          value={founded}
          onChange={e => setFounded(e.target.value)}
          placeholder="Ex: 1990"
          className="
            w-full bg-gray-700 text-white 
            p-3 rounded-lg border border-gray-600 
            focus:outline-none focus:ring-2 focus:ring-green-500
          "
        />
      </div>
      <div>
        <label className="block text-white text-sm mb-1">Cidade</label>
        <input
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Ex: São Paulo"
          className="
            w-full bg-gray-700 text-white 
            p-3 rounded-lg border border-gray-600 
            focus:outline-none focus:ring-2 focus:ring-green-500
          "
        />
      </div>

      {/* Botão verde full‑width que escala levemente no hover */}
      <button
        type="submit"
        className="
          w-full bg-green-500 text-white font-bold 
          py-3 px-6 rounded-lg 
          shadow-lg 
          transform transition-transform duration-200 
          hover:scale-105
        "
      >
        {isEditMode ? "Salvar Alterações" : "Adicionar Time"}
      </button>
    </form>
  );
}
