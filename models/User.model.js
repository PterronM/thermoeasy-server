const { Schema, model, default: mongoose } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "Nombre requerido"],
    },
    email: {
      type: String,
      required: [true, "Email requerido."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Contraseña requerida."],
    },
    imgPerfil: {
      type: String,
      default: "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png"
    },
    favoritos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receta",
    },
  ]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
