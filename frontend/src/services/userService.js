import { api, requestConfig } from "../utils/config";
import { getAuthToken } from "./pacienteService";

// pega detalhes do usuario
const profile = async (data, token) => {
  const config = requestConfig("GET", data, token);

  try {
    const res = await fetch(api + "/users/profile", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// update do usuario
const updateProfile = async (data, token) => {
  const config = requestConfig("PUT", data, token, true);

  try {
    const res = await fetch(api + "/users/", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async () => {
  const token = getAuthToken();
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/users", config)
      .then((res) => res.json())
      .catch((err) => {
        console.error("Erro ao buscar usuários:", err);
        return err;
      });
    return res;
  } catch (error) {
    console.error("Erro no catch getUsers:", error);
  }
};

const getCurrentAssistente = async () => {
  const token = getAuthToken();
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/assistente/atual", config)
      .then((res) => res.json())
      .catch((err) => err);
    return res;
  } catch (error) {
    console.log(error);
  }
};

// pega detalhes do usuario
const getUserDetails = async (id) => {
  const config = requestConfig("GET");

  try {
    const res = await fetch(api + "/users/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const userService = {
  profile,
  getUsers,
  updateProfile,
  getUserDetails,
  getCurrentAssistente,
};

export default userService;
