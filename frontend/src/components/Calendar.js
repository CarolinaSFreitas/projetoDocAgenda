import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptLocale from "@fullcalendar/core/locales/pt";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAgendamentos,
  createAgendamento,
  updateAgendamento,
  deleteAgendamento,
  associatePacienteToAgendamento,
  fetchAgendamentosAssistente,
  createAgendamentoAssistente,
} from "../slices/agendamentoSlice";
import { fetchPacientes } from "../slices/pacienteSlice";
import Modal from "react-modal";
import { format } from "date-fns";
import "./Calendar.css";

Modal.setAppElement("#root");

const Calendar = ({ isAssistente, userId }) => {
  const dispatch = useDispatch();
  const { agendamentos, agendamentosAssistente } = useSelector(
    (state) => state.agendamentos
  );
  const { pacientes, pacientePorMedico } = useSelector(
    (state) => state.pacientes
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
    tipo: "consulta", // padrão
  });
  const [selectedPaciente, setSelectedPaciente] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const calendarRef = useRef(null);

  useEffect(() => {
    if (isAssistente && userId) {
      dispatch(fetchAgendamentosAssistente(userId));
    } else {
      dispatch(fetchAgendamentos());
    }
    dispatch(fetchPacientes());
  }, [dispatch, userId, isAssistente]);

  if (!Array.isArray(agendamentos) && !Array.isArray(agendamentosAssistente)) {
    return <div>Erro ao carregar os agendamentos</div>;
  }

  const formatDateTimeLocal = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      throw new Error("Data inválida");
    }
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  const handleDateClick = (arg) => {
    const date = new Date(arg.dateStr + "T00:00:00");
    if (isNaN(date)) {
      console.error("Data inválida ao clicar na data:", arg.dateStr);
      return;
    }
    const formattedDate = formatDateTimeLocal(date);
    setEventDetails({
      title: "",
      start: formattedDate,
      end: formattedDate,
      description: "",
      tipo: "consulta", // reseta os campos
    });
    setCurrentEvent(null);
    setErrorMessage("");
    setModalIsOpen(true);
  };

  const handleEventClick = (info) => {
    const startDate = formatDateTimeLocal(new Date(info.event.start));
    const endDate = formatDateTimeLocal(
      new Date(info.event.end || info.event.start)
    );

    setCurrentEvent(info.event);
    setEventDetails({
      title: info.event.title,
      start: startDate,
      end: endDate,
      description: info.event.extendedProps.description,
      tipo: info.event.extendedProps.tipo || "consulta",
    });
    setModalIsOpen(true);
    setErrorMessage("");
  };

  const handleEventDrop = (info) => {
    const startDate = formatDateTimeLocal(new Date(info.event.start));
    const endDate = formatDateTimeLocal(
      new Date(info.event.end || info.event.start)
    );

    const updatedEventDetails = {
      ...eventDetails,
      start: startDate,
      end: endDate,
      tipo: info.event.extendedProps.tipo || "consulta",
    };

    dispatch(
      updateAgendamento({
        id: info.event.id,
        agendamentoData: updatedEventDetails,
      })
    ).then(() => {
      if (isAssistente) {
        dispatch(fetchAgendamentosAssistente(userId));
      } else {
        dispatch(fetchAgendamentos());
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePacienteChange = (e) => {
    setSelectedPaciente(e.target.value);
  };

  const handleVincularPaciente = async () => {
    if (currentEvent && selectedPaciente) {
      try {
        dispatch(
          associatePacienteToAgendamento({
            agendamentoId: currentEvent.id,
            pacienteId: selectedPaciente,
          })
        );

        if (isAssistente) {
          dispatch(fetchAgendamentosAssistente(userId));
        } else {
          dispatch(fetchAgendamentos());
        }

        const updatedEvent = isAssistente
          ? agendamentosAssistente.find(
              (event) => event._id === currentEvent.id
            )
          : agendamentos.find((event) => event._id === currentEvent.id);
        setCurrentEvent(updatedEvent);
        setEventDetails((prevDetails) => ({
          ...prevDetails,
          pacienteId: updatedEvent.pacienteId,
          pacienteNome: updatedEvent.pacienteId
            ? updatedEvent.pacienteId.nome
            : "",
        }));
        setSelectedPaciente("");
        setModalIsOpen(false); // fechar a modal após vincular o paciente
      } catch (error) {
        console.error("Erro ao vincular paciente:", error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // campos obrigatórios
    if (!eventDetails.title || !eventDetails.start || !eventDetails.end) {
      setErrorMessage(
        "Atenção! Os campos título, data inicial e data final são obrigatórios."
      );
      return;
    }

    // data/hora final não ser anterior à data/hora inicial
    if (new Date(eventDetails.end) < new Date(eventDetails.start)) {
      setErrorMessage(
        "Atenção! A data/hora final não pode ser anterior à data/hora inicial."
      );
      return;
    }

    // título ter pelo menos 3 caracteres
    if (eventDetails.title.length < 3) {
      setErrorMessage("Atenção! O título deve ter pelo menos 3 caracteres.");
      return;
    }


  // Verificar conflitos de horário, ignorando o evento atual
  const hasConflict = transformedEvents.some((event) => {
    if (currentEvent && event.id === currentEvent.id) {
      // Ignorar o evento atual
      return false;
    }

    const existingStart = new Date(event.start);
    const existingEnd = new Date(event.end || event.start);
    const newStart = new Date(eventDetails.start);
    const newEnd = new Date(eventDetails.end);

    // Verifica se os horários se sobrepõem
    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });

  if (hasConflict) {
    setErrorMessage(
      "Atenção! Já existe um evento programado neste horário."
    );
    return;
  }


    setErrorMessage("");

    if (currentEvent) {
      // atualiza event
      dispatch(
        updateAgendamento({
          id: currentEvent.id,
          agendamentoData: eventDetails,
        })
      ).then(() => {
        if (isAssistente) {
          dispatch(fetchAgendamentosAssistente(userId));
        } else {
          dispatch(fetchAgendamentos());
        }
      });
    } else {
      // criar event
      if (isAssistente) {
        dispatch(
          createAgendamentoAssistente({
            ...eventDetails,
            medicoId: userId,
          })
        ).then(() => {
          dispatch(fetchAgendamentosAssistente(userId));
        });
      } else {
        dispatch(createAgendamento(eventDetails)).then(() => {
          dispatch(fetchAgendamentos());
        });
      }
    }
    setModalIsOpen(false);
  };

  const handleDelete = () => {
    if (currentEvent) {
      dispatch(deleteAgendamento(currentEvent.id)).then(() => {
        if (isAssistente) {
          dispatch(fetchAgendamentosAssistente(userId));
        } else {
          dispatch(fetchAgendamentos());
        }
      });
      setModalIsOpen(false);
    }
  };

  const tipoOptions = ["consulta", "exame", "procedimento", "cirurgia", "indisponivel"];

  const tipoColors = {
    consulta: "#3498db",
    exame: "#2ecc71",
    procedimento: "#f39c12",
    cirurgia: "#e74c3c",
    indisponivel: "#7b8792",
  };

  const transformedEvents =
    isAssistente && userId && agendamentosAssistente
      ? agendamentosAssistente.map((agendamento) => ({
          id: agendamento._id,
          title: agendamento.title,
          start: agendamento.start,
          end: agendamento.end || agendamento.start, // end tem q ter um valor válido
          description: agendamento.description,
          backgroundColor: tipoColors[agendamento.tipo] || "#3498db",
          pacienteId: agendamento.pacienteId,
          pacienteNome: agendamento.pacienteId?.nome, // add o nome do paciente
          tipo: agendamento.tipo,
        }))
      : agendamentos.map((agendamento) => ({
          id: agendamento._id,
          title: agendamento.title,
          start: agendamento.start,
          end: agendamento.end || agendamento.start, // end tem q ter um valor válido
          description: agendamento.description,
          backgroundColor: tipoColors[agendamento.tipo] || "#3498db",
          pacienteId: agendamento.pacienteId,
          pacienteNome: agendamento.pacienteId?.nome, // add o nome do paciente
          tipo: agendamento.tipo,
        }));

  // verifica se é um array antes de mapear
  if (!Array.isArray(agendamentos) && !Array.isArray(agendamentosAssistente)) {
    return <p>Nenhum agendamento encontrado.</p>;
  }

  return (
    <div className={modalIsOpen ? "calendar-dimmed" : ""}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={transformedEvents}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        editable={true}
        selectable={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        locale={ptLocale}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button
          className="btn-fechar"
          onClick={() => setModalIsOpen(false)}
          style={{ float: "right" }}
        >
          &times;
        </button>
        <form onSubmit={handleSubmit} className="card-evento">
          <label id="label-titulo">
            <b>Título</b>
            <input
              id="input-titulo"
              type="text"
              name="title"
              value={eventDetails.title}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <b>Data/Hora Inicial:</b>
            <input
              id="campoData"
              type="datetime-local"
              name="start"
              value={eventDetails.start}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <b>Data/Hora Final:</b>
            <input
              id="campoData"
              type="datetime-local"
              name="end"
              value={eventDetails.end}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <b>Descrição:</b>
            <input
              id="input-descric"
              name="description"
              value={eventDetails.description}
              onChange={handleInputChange}
            />
          </label>
          <label>
            <b>Tipo:</b>
            <select
              name="tipo"
              value={eventDetails.tipo}
              onChange={handleInputChange}
            >
              {tipoOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                  style={{
                    backgroundColor: tipoColors[option],
                    color: "white",
                  }}
                >
                  {option}
                </option>
              ))}
            </select>
          </label>
          {currentEvent && currentEvent.id && (
            <>
              {currentEvent.extendedProps.pacienteId ? (
                <div>
                  Esse evento está vinculado ao paciente:{" "}
                  {currentEvent.extendedProps.pacienteNome}
                </div>
              ) : (
                <>
                  <label>
                    Vincular Paciente:
                    <select
                      value={selectedPaciente}
                      onChange={handlePacienteChange}
                    >
                      <option value="">Selecione um paciente</option>
                      {isAssistente && pacientePorMedico
                        ? pacientePorMedico?.map((paciente) => (
                            <option key={paciente._id} value={paciente._id}>
                              {paciente.nome}
                            </option>
                          ))
                        : pacientes.map((paciente) => (
                            <option key={paciente._id} value={paciente._id}>
                              {paciente.nome}
                            </option>
                          ))}
                    </select>
                  </label>
                  <button
                    className="btn"
                    type="button"
                    onClick={handleVincularPaciente}
                  >
                    Vincular Paciente
                  </button>
                </>
              )}
            </>
          )}
          <button className="btn" type="submit">
            {currentEvent ? "Atualizar" : "Criar"}
          </button>
          {currentEvent && (
            <button className="btn" type="button" onClick={handleDelete}>
              Deletar
            </button>
          )}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
      </Modal>
    </div>
  );
};

export default Calendar;
