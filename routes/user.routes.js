const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
const bcrypt = require("bcrypt");
// Require necessary (isAuthenticated) middleware in order to control access to specific routes
// const { isAuthenticated } = require("../middleware/auth.middleware.js");

//todo -----PATH ("/api/user/:idUser/update") => Recibe y actualiza los datos de un user por su id
router.patch("/:idUser/update", async (req, res, next) => {
  const { idUser } = req.params;
  const { email, password, passwordVerify, nombre } = req.body;


  if(email === "" || password === "" || nombre===""){
    res.status(401).json({message: "Todos los campos deben estar rellenos"});
    return;
  }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Añade direccion de correo correcta." });
      return;
    }

    
  if(password !== passwordVerify){
    res.status(400).json({message: "Las contraseñas no coinciden"})
    return;
  }

  // const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!passwordRegex.test(password)) {
  //   res.status(400).json({
  //     message:
  //       "La contraseña debe tener al menos 6 caracteres y contener al menos un número, una minúscula y una letra mayúscula.",
  //   });
  //   return;
  // }
  

  const salt =  await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password,salt)

  try {
    
    await User.findByIdAndUpdate(idUser, {
      email,
      password,
      nombre,
    });
    res.json("Documento Actualizado");
  } catch (error) {
    next(error);
  }
});

//todo -----DELETE ("/api/user/:idUser/delete") => Eliminar un usuario
router.delete("/:idUser/delete", async (req, res, next) => {
  const { idUser } = req.params;
  try {
    await User.findByIdAndDelete(idUser);
    res.json("Usuario Eliminado");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
