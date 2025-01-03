const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongooseDelete = require("mongoose-delete");

const agendamentoSchema = new Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  description: String,
  tipo: String,
  pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' }, 
  userId: mongoose.ObjectId,
  userName: String,

}, { timestamps: true, _id: true });

agendamentoSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });
const Agendamento = mongoose.model("Agendamento", agendamentoSchema);

module.exports = Agendamento;
