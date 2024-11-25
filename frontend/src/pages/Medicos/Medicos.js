import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentAssistente, getUsers } from "../../slices/userSlice";
import "./Medicos.css"; // Importação do arquivo CSS
import { sendHelpRequest } from "../../services/notificationService";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
export default function Medicos() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  const { assistenteAtual } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getCurrentAssistente());
  }, [dispatch]);

  const enviarNotificacao = () => toast("Pedido enviado com sucesso!");

  if (loading) return <div className="loading">Carregando...</div>;
  if (error)
    return <div className="error">Erro ao carregar usuários: {error}</div>;

  const handleHelpRequest = async (medicoId) => {
    try {
      await sendHelpRequest(medicoId);
      enviarNotificacao();
    } catch (error) {
      console.error("Erro ao enviar pedido de ajuda:", error);
    }
  };

  const medicosFiltrados = Object.values(user)
  ?.filter((userItem) => !assistenteAtual?.medicoIds?.includes(userItem?._id))
  .filter(
    (userItem) =>
      userItem.name && userItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    if (!a.name || !b.name) return 0;
    return a.name.localeCompare(b.name);
  });

const medicosAcessados = Object.values(user)
  ?.filter((userItem) => assistenteAtual?.medicoIds?.includes(userItem?._id))
  .sort((a, b) => {
    if (!a.name || !b.name) return 0;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="medicos-container">
      <h1 className="medicos-title">Médicos disponíveis para solicitação:</h1>
      <div className="filtro-busca medico-busca">
        <input
          type="text"
          placeholder="Buscar médico pelo nome"
          value={searchTerm}
          className="input-busca"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul className="medicos-list">
        {medicosFiltrados &&
        medicosFiltrados.length > 0 &&
        Array.isArray(medicosFiltrados) ? (
          medicosFiltrados.map((usuario) => (
            <li key={usuario._id}>
              <p className="medicos-name">{usuario.name}</p>
              <div className="medicos-actions">
                <button
                  className="btn-ajudar"
                  onClick={() => handleHelpRequest(usuario._id)}
                >
                  Solicitar Acesso
                </button>
              </div>
            </li>
          ))
        ) : (
          <li>Nenhum médico encontrado</li>
        )}
      </ul>
       {/* Médicos já acessados pelo assistente */}
       <h2 className="medicos-title2">Médicos que você possui acesso:</h2>
      <ul className="medicos-list acessados">
        {medicosAcessados && medicosAcessados.length > 0 ? (
          medicosAcessados.map((usuario) => (
            <li key={usuario._id}>
              <p className="medicos-name">{usuario.name}</p>
            </li>
          ))
        ) : (
          <li>Nenhum médico encontrado</li>
        )}
      </ul>
      <ToastContainer />
    </div>
  );
}
