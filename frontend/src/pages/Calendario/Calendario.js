import React from "react";
import Calendar from "../../components/Calendar";
import AssistenteCalendario from "./AssistenteCalendario";

const Calendario = () => {
  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;

  return (
    <div className="calendario">
      {userData.isAssistente ? <AssistenteCalendario /> : <Calendar />}
    </div>
  );
};

export default Calendario;
