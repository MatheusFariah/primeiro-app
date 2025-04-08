// src/app/components/addteamform.tsx
import { useState } from "react";

const AddTeamForm = () => {
  const [teamName, setTeamName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Novo time: ${teamName}`);
    // Aqui você pode adicionar lógica para salvar o time
  };

  return (
    <div className="bg-black text-white p-6 rounded-md shadow-md">
      <h3 className="text-2xl font-bold mb-4">Adicionar Novo Time</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Nome do time"
          className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full py-2 bg-green-500 rounded-md text-white hover:bg-green-600 transition duration-300"
        >
          Adicionar Time
        </button>
      </form>
    </div>
  );
};

export default AddTeamForm;
