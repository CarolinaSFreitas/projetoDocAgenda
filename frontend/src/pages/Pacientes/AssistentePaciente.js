import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentAssistente, getUsers } from "../../slices/userSlice";

import "../Calendario/AssistenteAgendamento.css";
import "./AssistentePaciente.css";
import { useNavigate } from "react-router-dom";

export default function AssistentePaciente() {
  const dispatch = useDispatch();
  const { assistenteAtual } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.user);
  const [medicosFiltrados, setMedicosFiltrados] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCurrentAssistente());
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    const fetchAndFilterMedicos = async () => {
      if (
        assistenteAtual &&
        assistenteAtual?.medicoIds &&
        Array.isArray(user)
      ) {
        const filteredMedicos = user
          .filter((userItem) =>
            assistenteAtual.medicoIds.includes(userItem._id)
          )
          .sort((a, b) => {
            if (!a.name || !b.name) return 0; // Verifica se o name é undefined
            return a.name.localeCompare(b.name);
          });
        setMedicosFiltrados(filteredMedicos);
      } else {
        setMedicosFiltrados([]);
      }
    };
  
    fetchAndFilterMedicos();
  }, [assistenteAtual, user]);

  function redirectToPacientes(medicoId) {
    navigate(`/listaPacienteAssistente/${medicoId}`);
  }

  return (
    <div className="container">
      <div>
        <h1 className="title">Escolha o médico para acessar e organizar os dados dos pacientes</h1>
        <ul className="medico-list">
          {medicosFiltrados.length > 0 ? (
            medicosFiltrados.map((medico) => (
              <li
                key={medico._id}
                className="medico-item"
                onClick={() => redirectToPacientes(medico._id)}
              >
                {medico.name}
              </li>
            ))
          ) : (
            <p className="no-medicos">Nenhum médico encontrado</p>
          )}
        </ul>
      </div>
    </div>
  );
}
