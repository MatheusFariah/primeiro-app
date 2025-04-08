// src/app/teams/add.tsx
import Sidebar from "../components/sidebar";
import AddTeamForm from "../components/addteamform";

const AddTeamPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-4xl font-bold text-white">Adicionar Novo Time</h2>
        <AddTeamForm />
      </div>
    </div>
  );
};

export default AddTeamPage;
