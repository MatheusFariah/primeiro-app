"use client";  // Garantir que o código esteja sendo executado no lado do cliente

import { useState, useEffect } from "react";
import Table from "../components/table";

const Teams = () => {
  const [teams, setTeams] = useState<any[]>([]);  // Inicializa como um array vazio
  const [searchTerm, setSearchTerm] = useState("");  // Para armazenar o termo de pesquisa
  const [loading, setLoading] = useState(true);  // Para controlar o estado de carregamento
  const [error, setError] = useState<string | null>(null);  // Para armazenar erros

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);  // Ativa o loading
      try {
        const response = await fetch("http://localhost:5000/teams");
        const data = await response.json();

        // Verifica se os dados são um array antes de tentar usá-los
        if (Array.isArray(data)) {
          setTeams(data);  // Atualiza o estado com os times
        } else {
          setError("Dados inválidos retornados do servidor.");
        }
      } catch (error) {
        console.error("Erro ao buscar os times:", error);
        setError("Erro ao buscar os times.");
      } finally {
        setLoading(false);  // Desativa o loading
      }
    };

    fetchTeams();
  }, []);  // Este efeito será executado apenas uma vez ao montar o componente

  // Filtra os times com base no termo de pesquisa
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <h2 className="text-5xl font-black text-white mb-4">Times</h2>

      {/* Campo de pesquisa */}
      <div className="mb-6 flex justify-between items-center mt-12">
        <input
          type="text"
          placeholder="Pesquisar Times"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-8 py-2 pl-12 rounded-xl bg-gray-800 text-white border-2 border-gray-700"
        />
      </div>

      {/* Exibe o status de erro, se houver */}
      {error && (
        <div className="mb-6 p-3 rounded text-center bg-red-600 text-white">
          {error}
        </div>
      )}

      {/* Exibe o loading enquanto os dados estão sendo carregados */}
      {loading ? (
        <div className="text-center text-gray-500">Carregando...</div>
      ) : (
        <div className="mt-10">
          <Table>
            <thead className="bg-gray-900 uppercase text-sm text-gray-400">
              <tr>
                <th className="px-6 py-3 text-left">Time</th>
                <th className="px-6 py-3 text-left">Técnico</th>
                <th className="px-6 py-3 text-left">Jogadores</th>
                <th className="px-6 py-3 text-left">Valor</th>
                <th className="px-6 py-3 text-left">Fundação</th>
              </tr>
            </thead>
            <tbody className="bg-gray-950 divide-y divide-gray-800">
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">
                    Nenhum time encontrado.
                  </td>
                </tr>
              ) : (
                filteredTeams.map((team) => (
                  <tr key={team.id}>
                    <td className="px-6 py-3 font-bold text-green-500">
                      {team.name}
                    </td>
                    <td className="px-6 py-3">{team.coach}</td>
                    <td className="px-6 py-3">{team.players}</td>
                    <td className="px-6 py-3">{team.value}</td>
                    <td className="px-6 py-3">{team.founded}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Teams;
