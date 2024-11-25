import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAgendamentos,
  fetchAgendamentosAssistente,
} from "../slices/agendamentoSlice";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import "./EventList.css";
import { getUserDetails } from "../slices/userSlice";

const AgendamentoList = ({ isAssistente, userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { agendamentos, agendamentosAssistente } = useSelector(
    (state) => state.agendamentos
  );
  const { user } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false); // Estado para controlar a exibição de todos os agendamentos

  useEffect(() => {
    if (isAssistente && userId) {
      dispatch(fetchAgendamentosAssistente(userId));
      dispatch(getUserDetails(userId));
    } else {
      dispatch(fetchAgendamentos());
    }
  }, [dispatch, isAssistente, userId]);

  const handleViewPaciente = (id) => {
    navigate(`/paciente/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleToggleShowAll = () => {
    setShowAll((prevShowAll) => !prevShowAll);
  };

  const renderAgendamentoList = () => {
    const agendamentosToRender = isAssistente
      ? agendamentosAssistente
      : agendamentos;

    if (!Array.isArray(agendamentosToRender)) {
      return <p>Nenhum agendamento encontrado.</p>;
    }

    // Data atual
    const currentDate = new Date();

    // Filtro de agendamentos por paciente e por data
    const filteredAgendamentos = agendamentosToRender.filter((agendamento) => {
      const pacienteNome = agendamento?.pacienteId?.nome?.toLowerCase() || "";
      const agendamentoDate = new Date(agendamento.start);

      // Mostrar todos os agendamentos se showAll for true, ou apenas os futuros se for false
      const isFutureOrToday = agendamentoDate >= currentDate;
      return (
        (showAll || isFutureOrToday) &&
        pacienteNome.includes(searchTerm.toLowerCase())
      );
    });

    // Ordena os agendamentos por data
    const sortedAgendamentos = filteredAgendamentos.sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    );

    return (
      <table id="lista">
        <thead>
          <tr>
            <th>Evento</th>
            <th>Data e Hora</th>
            <th>Tipo</th>
            <th>Paciente</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedAgendamentos.map((agendamento) => (
            <tr key={agendamento._id}>
              <td>{agendamento.title}</td>
              <td>{`${format(
                new Date(agendamento.start),
                "dd/MM/yyyy HH:mm"
              )} - ${format(
                new Date(agendamento.end || agendamento.start),
                "HH:mm"
              )}`}</td>
              <td>{agendamento.tipo}</td>
              <td>
                {agendamento.pacienteId ? agendamento.pacienteId.nome : "-"}
              </td>
              <td>
                {agendamento.pacienteId && (
                  <button
                    onClick={() =>
                      handleViewPaciente(agendamento.pacienteId._id)
                    }
                    className="btn-ver"
                  >
                    Ver Paciente
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <div className="topoAgenda">
        <h1>
          {isAssistente && userId
            ? `Agendamentos de ${user?.name}`
            : "Meus Agendamentos"}
        </h1>
        <div className="filtros">
          <span className="filtro">
            <input
              type="text"
              placeholder="Filtrar agendamentos por pacientes"
              id="filtroPaciente"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </span>
          <button onClick={handleToggleShowAll} className="botao-incluir">
            {showAll ? (<em className="ativo">Incluir Agendamentos Passados</em>) : (<em>Incluir Agendamentos Passados</em>)}
          </button>
        </div>
      </div>
      {agendamentos.length === 0 && agendamentosAssistente?.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        renderAgendamentoList()
      )}
    </div>
  );
};

export default AgendamentoList;
