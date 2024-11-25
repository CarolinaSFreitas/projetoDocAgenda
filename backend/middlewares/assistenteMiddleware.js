const Assistente = require("../models/Assistente");

const assistenteMiddleware = async (req, res, next) => {
  if (req.user && req.user.isAssistente) {
    const assistente = await Assistente.findById(req.user._id);
    if (assistente && assistente.userId) {
      req.user._id = assistente.userId; // Substitui o ID do assistente pelo ID do médico
    }
  }
  next();
};

module.exports = assistenteMiddleware;
