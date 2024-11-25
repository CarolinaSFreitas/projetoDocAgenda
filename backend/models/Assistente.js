const mongoose = require("mongoose");
const { Schema } = mongoose;

const assistenteSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    medicoIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const Assistente = mongoose.model("Assistente", assistenteSchema);

module.exports = Assistente;
