import React from "react";
import PacientesList from "../../components/PacientesList";
import AssistentePaciente from "./AssistentePaciente";

const MeusPacientes = () => {
  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;
  return (
    <div className="meus-pacientes">
      {userData.isAssistente ? <AssistentePaciente /> : <PacientesList />}
    </div>
  );
};

export default MeusPacientes;
