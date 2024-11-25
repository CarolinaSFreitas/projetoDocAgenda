import React, { useEffect, useState } from "react";
import "./Navbar.css";

// Hooks
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Redux
import { logout, reset } from "../slices/authSlice";

// components
import { NavLink, Link } from "react-router-dom";
import {
  adicionaAssitenteAoMedico,
  fetchNotifications,
} from "../services/notificationService";
import {
  updateHelpStatus,
  deleteNotification,
} from "../services/notificationService";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const { auth } = useAuth();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());

    navigate("/login");
  };

  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchNotifications();
      console.log(data);
      setNotifications(data);
    };

    loadNotifications();
  }, []);

  const notificacaoAceitar = () => toast("Acesso Liberado");
  const notificacaoNegar = () => toast("Acesso negado");

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleAccept = async (notificationId, assistenteId) => {
    try {
      await adicionaAssitenteAoMedico(userData._id, assistenteId);
      await updateHelpStatus(notificationId, "accepted");
      console.log("Acesso Liberado");
      notificacaoAceitar();
      // Remover a notificação aceita do estado
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
      await deleteNotification(notificationId);
    } catch (error) {
      console.error("Erro ao liberar o acesso:", error);
    }
  };

  const handleReject = async (notificationId) => {
    try {
      await updateHelpStatus(notificationId, "rejected");
      console.log("Acesso Negado");
      notificacaoNegar();
      // Remover a notificação negada do estado
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
      await deleteNotification(notificationId);
    } catch (error) {
      console.error("Erro ao negar acessso:", error);
    }
  };

  return (
    <>
      <nav id="nav">
        <Link to="/" className="linkLogo">
          <img src="/logo-doc.svg" alt="DocAgenda" id="logo" />
        </Link>
        <ul id="nav-links">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          {auth &&
          userData &&
          userData.isAssistente !== null &&
          !userData.isAssistente ? (
            <>
              <li>
                <NavLink to="/calendario">Calendario</NavLink>
              </li>
              <li>
                <NavLink to="/lista">Agendamentos</NavLink>
              </li>
              <li>
                <NavLink to="/pacientes">Pacientes</NavLink>
              </li>
              <div className="notification-container">
                <div
                  className="notification-icon"
                  onClick={toggleNotifications}
                >
                  <img
                    src="/bell.svg"
                    className="bell-icon"
                    alt="Notificações"
                  />
                  {notifications?.length > 0 && (
                    <span className="notification-count">
                      {notifications?.length}
                    </span>
                  )}
                </div>
                {showNotifications && (
                  <div className="notification-popup">
                    {notifications?.length > 0 ? (
                      notifications?.map((notification, index) => {
                        return (
                          <div key={index} className="notification-item">
                            {notification?.message}
                            <div className="notification-buttons">
                              <button
                                className="accept-button"
                                onClick={() =>
                                  handleAccept(
                                    notification._id,
                                    notification.senderId
                                  )
                                }
                              >
                                Aceitar
                              </button>
                              <button
                                className="reject-button"
                                onClick={() => handleReject(notification._id)}
                              >
                                Negar
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="notification-item">
                        Nenhuma notificação
                      </div>
                    )}
                  </div>
                )}
              </div>
              <li>
                <span onClick={handleLogout}>Sair</span>
              </li>
            </>
          ) : userData &&
            userData.isAssistente !== null &&
            userData.isAssistente ? (
            <>
              <li>
                <NavLink to="/calendario">Calendário</NavLink>
              </li>
              <li>
                <NavLink to="/lista">Agendamentos</NavLink>
              </li>
              <li>
                <NavLink to="/pacientes">Pacientes</NavLink>
              </li>
              <li>
                <NavLink to="/medicos">Médicos</NavLink>
              </li>
              <li>
                <span onClick={handleLogout}>Sair</span>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login">Entrar</NavLink>
              </li>
              <li>
                <NavLink to="/register">Cadastrar Médico</NavLink>
              </li>
              <li>
                <NavLink to="/registerAssistente">Cadastrar Assistente</NavLink>
              </li>
              <li>
                <NavLink to="/about">Sobre</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      <ToastContainer />
    </>
  );
};

export default Navbar;
