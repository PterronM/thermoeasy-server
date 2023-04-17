const { Schema, model, default: mongoose } = require("mongoose");


const recetaSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    ingredientes: {
      type: Array,
      required: true,
    },
    preparacion: {
        type: String,
        require: true
    },
    nPersonas: {
      type: Number,
      require:true
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    img: String
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Receta = model("Receta", recetaSchema);

module.exports = Receta;
