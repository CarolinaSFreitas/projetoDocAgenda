// pages/EventList.js
import React from "react";
import EventList from "../../components/EventList";
import AssistenteAgendamento from "./AssistenteAgendamento";

const ListaEventos = () => {
  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;
  return (
    <div>
      {userData.isAssistente ? (
        <AssistenteAgendamento />
      ) : (
        <EventList isAssistente={false} />
      )}
    </div>
  );
};

export default ListaEventos;
