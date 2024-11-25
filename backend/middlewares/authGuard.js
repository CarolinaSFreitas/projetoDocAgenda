const User = require("../models/User");
const Assistente = require("../models/Assistente"); // Importar o modelo Assistente
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // checar se o cabecalho da requisicao tem autorizacao
  if (!token) return res.status(401).json({ errors: ["Acesso negado!"] });

  // checar se o token é valido
  try {
    const verified = jwt.verify(token, jwtSecret);

    // Tentar encontrar o usuário
    req.user = await User.findById(verified.id).select("-password");

    // Se não encontrar o usuário, tentar encontrar o assistente
    if (!req.user) {
      req.assistente = await Assistente.findById(verified.id).select(
        "-password"
      );
    }

    if (!req.user && !req.assistente) {
      return res
        .status(401)
        .json({ errors: ["Usuário ou assistente não encontrado!"] });
    }

    next();
  } catch (err) {
    res.status(400).json({ errors: ["O Token é inválido!"] });
  }
};

module.exports = authGuard;
