import React from "react";
import { Link, useParams } from "react-router-dom";
import PacientesList from "../../components/PacientesList";

export default function AssistentePacienteList() {
  const { medicoId } = useParams();

  return (
    <div>
      <Link to="/pacientes">
        <u id="btn-voltar">Voltar</u>
      </Link>
      <PacientesList isAssistente={true} userId={medicoId} />
    </div>
  );
}
