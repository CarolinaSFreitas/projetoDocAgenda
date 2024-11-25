const express = require("express");
const router = express();

router.use("/api/users", require("./UserRoutes"));
router.use("/api/agendamento", require("./AgendamentoRoutes"));
router.use("/api/paciente", require("./PacienteRoutes"));
router.use("/api/assistente", require("./AssistenteRoutes"));
router.use("/api/notifications", require("./NotificationRoutes"));

module.exports = router;
