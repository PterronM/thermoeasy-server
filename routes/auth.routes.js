const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const  isAuthenticated  = require("../middleware/auth.middleware");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

//TODO----POST "/api/auth/signup" => Registrar al usuario en la BD
router.post("/signup", async (req, res, next) => {
  const { email, password, passwordVerify,nombre } = req.body;
  // const { email, password, nombre } = req.body;

  // Check if email or password or nombre are provided as empty strings
  if (email === "" || password === ""|| passwordVerify === "" || nombre === "") {
    res.status(400).json({ errorMessage: "Añade email, contraseña y Usuario" });
    return;
  }

  if(password !== passwordVerify){
    res.status(400).json({errorMessage: "Las contraseña no coinciden"})
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ errorMessage: "Provide a valid email address." });
    return;
  }

  //! todo REQUISITOS DEL PASSWORD
  // const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!passwordRegex.test(password)) {
  //   res.status(400).json({
  //     message:
  //       "La contraseña debe tener al menos 6 caracteres y contener al menos un número, una minúscula y una letra mayúscula",
  //   });
  //   return;
  // }

  try {
    const emailFound = await User.findOne({email: email})
    if(emailFound){
      return res.status(400).json({errorMessage: "Email registrado"})
    }
    const nombreFound = await User.findOne({nombre:nombre})
    if(nombreFound){
      return res.status(400).json({errorMessage: "Nombre de usuario registrado"})
    }
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password,salt)

    await User.create({
      nombre,
      email,
      password: hashPassword
    })
    res.status(201).json("Usuario registrado correctamente")

  } catch (error) {
    next(error)
  }
});

//TODO----- POST "api/auth/login" => Validar credenciales del usuario
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ errorMessage: "Añade email y contraseña." });
    return;
  }
  try {
    const userFound = await User.findOne({email: email});
    if(!userFound){
      return res.status(400).json({errorMessage: "Credenciales incorrectas"});
    }else{
      const checkPassword = await bcrypt.compare(password, userFound.password);

      if(!checkPassword){
        return res.status(400).json({errorMessage: "Credenciales incorrectas"})
      }
    }

    const payload = {
      _id: userFound._id,
      email: userFound.email,
      nombre: userFound.nombre,
      profileImage: userFound.imgPerfil
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d"
    });

    res.status(200).json({
      authToken
    })

  } catch (error) {
    next(error)
  }
});

//TODO---- GET "api/auth/verify" => Verificamos si el usuario esta activo o no
router.get("/verify", isAuthenticated,(req,res,next)=>{
  // console.log(req.payload)
  res.status(200).json(req.payload)
})

module.exports = router;
