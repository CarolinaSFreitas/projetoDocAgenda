import React from "react";
import { useParams } from "react-router-dom"; // Importa o hook useParams
import EventList from "../../components/EventList";

export default function ListEventosAssistente() {
  const { medicoId } = useParams();

  return (
    <div>
      <EventList isAssistente={true} userId={medicoId} />
    </div>
  );
}
