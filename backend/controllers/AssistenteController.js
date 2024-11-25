const Assistente = require("../models/Assistente");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Agendamento = require("../models/Agendamento");

const jwtSecret = process.env.JWT_SECRET;

// Gerar token para o assistente
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

// Registrar assistente
const registerAssistente = async (req, res) => {
  const { name, email, password } = req.body;

  // Verificar se o assistente já existe
  const assistente = await Assistente.findOne({ email });

  if (assistente) {
    res.status(422).json({ errors: ["Por favor, utilize outro e-mail."] });
    return;
  }

  // Gerar hash da senha
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // Criar assistente
  const newAssistente = await Assistente.create({
    name,
    email,
    password: passwordHash,
  });

  if (!newAssistente) {
    res.status(422).json({
      errors: ["Houve um erro, por favor tente novamente mais tarde."],
    });
    return;
  }

  res.status(201).json({
    _id: newAssistente._id,
    token: generateToken(newAssistente._id),
  });
};

// Obter assistente atual
const getCurrentAssistente = async (req, res) => {
  const assistente = req.assistente;
  res.status(200).json(assistente);
};

// Vincular assistente a um médico
const linkToMedico = async (req, res) => {
  const { medicoId, assistenteId } = req.body;
  const assistente = await Assistente.findById(assistenteId);

  if (!mongoose.Types.ObjectId.isValid(medicoId)) {
    return res.status(400).json({ error: "ID de médico inválido" });
  }

  if (!mongoose.Types.ObjectId.isValid(assistenteId)) {
    return res.status(400).json({ error: "ID de assistente inválido" });
  }

  const medico = await User.findById(medicoId);
  if (!medico) {
    return res.status(404).json({ error: "Médico não encontrado" });
  }

  assistente.medicoIds.push(medico._id);
  await assistente.save();

  res
    .status(200)
    .json({ message: "Assistente vinculado ao médico com sucesso" });
};

const getAllAssistentes = async (req, res) => {
  try {
    const assistentes = await Assistente.find().select("-password");
    res.status(200).json(assistentes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerAssistente,
  getCurrentAssistente,
  linkToMedico,
  getAllAssistentes,
};
