const User = require("../models/User");
const Paciente = require("../models/Paciente");
const { default: mongoose } = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

// pega todos os pacientes
const getAllPacient = async (req, res) => {
  const pacientes = await Paciente.find({}).sort({ createdAt: -1 });

  res.status(200).json(pacientes);
};

const getPacientes = async (req, res) => {
  let userId;

  if (req.user) {
    userId = req.user._id;
  } else {
    userId = req.assistente._id;
  }

  try {
    const pacientes = await Paciente.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPacientePorMedico = async (req, res) => {
  const { userId } = req.params;

  const pacientes = await Paciente.find({ userId });
  res.status(200).json(pacientes);
};

const getMedicosComPacientes = async (req, res) => {
  try {
    const medicos = await User.find({}).select("-password");
    const resultado = [];

    for (const medico of medicos) {
      const pacientes = await Paciente.find({ userId: medico.id });
      resultado.push({
        medico: medico,
        pacientes: pacientes,
      });
    }

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// pega um paciente
const getPaciente = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "ID de paciente inválido" });
  }

  try {
    const paciente = await Paciente.findById(id);

    if (!paciente) {
      return res.status(404).json({ error: "O paciente não foi encontrado" });
    }

    res.status(200).json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// cria novo paciente
const createPaciente = async (req, res) => {
  const { nome } = req.body;

  let user;

  if (req.user) {
    user = req.user._id;
  } else {
    user = req.assistente._id;
  }

  if (!nome) {
    return res.status(400).json({ error: "O nome do paciente é obrigatório." });
  }

  try {
    const paciente = await Paciente.create({
      ...req.body,
      userId: user._id,
      userName: user.name,
    });
    res.status(200).json({ result: paciente, status: "success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/*
// deleta um paciente
 const deletePaciente = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "ID de paciente inválido" });
  }

  try {
    const paciente = await Paciente.findOneAndDelete({ _id: id });

    if (!paciente) {
      return res.status(404).json({ error: "O paciente não foi encontrado" });
    }

    res.status(200).json("Paciente deletado com sucesso");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; */


const deletePaciente = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "ID de paciente inválido" });
  }

  try {
    const paciente = await Paciente.findById(id);

    if (!paciente) {
      return res.status(404).json({ error: "O paciente não foi encontrado" });
    }

    // Soft delete usando o plugin mongoose-delete
    await paciente.delete();

    res.status(200).json("Paciente deletado com sucesso");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPacientesIncludingDeleted = async (req, res) => {
  try {
    const pacientes = await Paciente.findWithDeleted().sort({ createdAt: -1 });
    res.status(200).json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// atualiza informações do paciente
const updatePaciente = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID de paciente inválido" });
  }

  try {
    const paciente = await Paciente.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true } // p retornar o documento atualizado
    );

    if (!paciente) {
      return res.status(404).json({ error: "O paciente não foi encontrado" });
    }

    res.status(200).json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchPaciente = async (req, res) => {
  const { q } = req.query;

  const userId = req.user._id;

  try {
    const pacientes = await Paciente.find({
      nome: new RegExp(q, "i"),
      userId: userId,
    }).exec();

    res.status(200).json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const searchPacienteAssistente = async (req, res) => {
  const { q, userId } = req.query;

  try {
    const pacientes = await Paciente.find({
      nome: new RegExp(q, "i"),
      userId: userId,
    }).exec();

    res.status(200).json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// adiciona um exame a um paciente
const addExame = async (req, res) => {
  const { id } = req.params;
  const { tipo, resultado, observacoes } = req.body;
  const file = req.file;

  let emptyFields = [];
  if (!tipo) emptyFields.push("tipo");
  if (!file) emptyFields.push("anexo");

  if (emptyFields.length > 0) {
    return res.status(400).json({
      error: "Por favor, preencha todos os dados obrigatórios",
      emptyFields,
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "ID de paciente inválido" });
  }

  try {
    const paciente = await Paciente.findById(id);
    if (!paciente) {
      return res.status(404).json({ error: "O paciente não foi encontrado" });
    }

    const exame = { tipo, resultado, observacoes, anexoId: file.filename };
    paciente.exame.push(exame);
    await paciente.save();

    res.status(200).json({ result: paciente, status: "success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// baixar um anexo
const downloadAnexo = async (req, res) => {
  const { id, exameId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(exameId)
  ) {
    return res.status(404).json({ error: "ID inválido" });
  }

  try {
    const paciente = await Paciente.findById(id);
    if (!paciente) {
      return res.status(404).json({ error: "O paciente não foi encontrado" });
    }

    const exame = paciente.exame.id(exameId);
    if (!exame || !exame.anexoId) {
      return res
        .status(404)
        .json({ error: "O exame ou anexo não foi encontrado" });
    }

    const filePath = path.join(__dirname, "../uploads", exame.anexoId);

    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({ error: "Arquivo não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// obter um exame
const getExame = async (req, res) => {
  const { id, exameId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(exameId)
  ) {
    return res.status(404).json({ error: "ID inválido" });
  }

  try {
    const paciente = await Paciente.findById(id);
    if (!paciente) {
      return res.status(404).json({ error: "O paciente não foi encontrado" });
    }

    const exame = paciente.exame.id(exameId);
    if (!exame || !exame.anexoId) {
      return res
        .status(404)
        .json({ error: "O exame ou anexo não foi encontrado" });
    }

    const filePath = path.join(__dirname, "../uploads", exame.anexoId);

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "Arquivo não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// deletar um exame
const deleteExame = async (req, res) => {
  const { id, exameId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(exameId)
  ) {
    return res.status(404).json({ error: "ID inválido" });
  }

  try {
    const paciente = await Paciente.findById(id);
    if (!paciente) {
      return res.status(404).json({ error: "O paciente não foi encontrado" });
    }

    const exame = paciente.exame.id(exameId);
    if (!exame) {
      return res.status(404).json({ error: "O exame não foi encontrado" });
    }

    const anexoId = exame.anexoId;
    paciente.exame.pull({ _id: exameId }); // pull pra remover subdocumentos no mongo pull
    await paciente.save();

    if (anexoId) {
      const filePath = path.join(__dirname, "../uploads", anexoId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({ result: paciente, status: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPacienteComMedico = async (req, res) => {
  const { nome, medicoId } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "O nome do paciente é obrigatório." });
  }

  if (!medicoId || !mongoose.Types.ObjectId.isValid(medicoId)) {
    return res
      .status(400)
      .json({ error: "ID de médico inválido ou não fornecido." });
  }

  try {
    const medico = await User.findById(medicoId);
    if (!medico) {
      return res.status(404).json({ error: "Médico não encontrado." });
    }

    const paciente = await Paciente.create({
      ...req.body,
      userId: medico._id,
      userName: medico.name,
    });
    res.status(200).json({ result: paciente, status: "success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllPacient,
  getPacientes,
  getPacientePorMedico,
  getMedicosComPacientes,
  getPaciente,
  createPaciente,
  deletePaciente,
  updatePaciente,
  searchPaciente,
  searchPacienteAssistente,
  addExame,
  downloadAnexo,
  getExame,
  deleteExame,
  createPacienteComMedico,
  getAllPacientesIncludingDeleted,
};
