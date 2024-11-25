import { api, requestConfig } from "../utils/config";
import { getAuthToken } from "./pacienteService";

export const fetchNotifications = async () => {
  const token = getAuthToken();
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/notifications", config);
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
  }
};

export const sendHelpRequest = async (receiverId) => {
  const token = getAuthToken();
  const config = requestConfig(
    "POST",
    { receiverId, type: "help_request" },
    token
  );

  try {
    const res = await fetch(api + "/notifications", config);
    return await res.json();
  } catch (error) {
    console.error("Erro ao enviar pedido de ajuda:", error);
  }
};

export const checkHelpStatus = async () => {
  const token = getAuthToken();
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/notifications/status", config);
    return await res.json();
  } catch (error) {
    console.error("Erro ao verificar status de ajuda:", error);
  }
};

export const updateHelpStatus = async (notificationId, status) => {
  const token = getAuthToken();
  const config = requestConfig("PUT", { status }, token);

  try {
    const res = await fetch(`${api}/notifications/${notificationId}`, config);
    return await res.json();
  } catch (error) {
    console.error("Erro ao atualizar status de ajuda:", error);
  }
};

export async function adicionaAssitenteAoMedico(medicoId, assistenteId) {
  const token = getAuthToken();
  const config = requestConfig("POST", { medicoId, assistenteId }, token);

  try {
    const res = await fetch(`${api}/assistente/linkToMedico`, config);
    return await res.json();
  } catch (error) {
    console.error("Erro ao adicionar assistente ao médico:", error);
  }
}

export const deleteNotification = async (notificationId) => {
  const token = getAuthToken();
  const config = requestConfig("DELETE", null, token);

  try {
    const res = await fetch(`${api}/notifications/${notificationId}`, config);
    return await res.json();
  } catch (error) {
    console.error("Erro ao deletar notificação:", error);
  }
};
