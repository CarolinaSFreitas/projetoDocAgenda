const express = require("express");
const router = express.Router();
const {
  getAllAssistentes,
  registerAssistente,
  linkToMedico,
  getCurrentAssistente,
} = require("../controllers/AssistenteController");
const authGuard = require("../middlewares/authGuard");
const {
  assistenteCreateValidation,
} = require("../middlewares/assistenteValidations");
const validate = require("../middlewares/handleValidations");

// Rota para obter todos os assistentes
router.get("/", authGuard, getAllAssistentes);

router.get("/atual", authGuard, getCurrentAssistente);

router
  .post("/register", assistenteCreateValidation(), validate, registerAssistente)
  .post("/linkToMedico", authGuard, linkToMedico);

module.exports = router;
