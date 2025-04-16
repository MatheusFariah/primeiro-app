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

  const isEditMode = !!existingTeam?.id; // se tiver ID, é edição

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Substituir por chamada à API (POST ou PUT) se desejar
    console.log(
      isEditMode ? "Atualizando time" : "Criando novo time",
      name,
      founded,
      city
    );
    // Ao terminar
    onSubmitSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-200 text-sm mb-1">Nome do Time</label>
        <input
          className="w-full bg-gray-700 text-white p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex. FutStat FC"
        />
      </div>
      <div>
        <label className="block text-gray-200 text-sm mb-1">Fundado em</label>
        <input
          className="w-full bg-gray-700 text-white p-2 rounded"
          value={founded}
          onChange={(e) => setFounded(e.target.value)}
          placeholder="Ex. 1990"
        />
      </div>
      <div>
        <label className="block text-gray-200 text-sm mb-1">Cidade</label>
        <input
          className="w-full bg-gray-700 text-white p-2 rounded"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ex. São Paulo"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-2"
      >
        {isEditMode ? "Salvar Alterações" : "Adicionar Time"}
      </button>
    </form>
  );
}
