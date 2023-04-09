const express = require("express");
const router = express.Router();
const Receta = require("../models/Receta.model.js");
const isAuthenticated = require("../middleware/auth.middleware.js");

//todo -----GET ("/api/receta/allRecetas") => Devuelve todas las recetas de BD
router.get("/", async (req, res, next) => {
  try {
    const response = await Receta.find().populate();
    res.json(response);
  } catch (error) {
    next(error);
  }
});

//todo ------POST ("api/receta/crear-receta") => Crear una receta
router.post("/crear-receta", isAuthenticated,async (req, res, next) => {
  
  const { titulo, ingredientes, preparacion,nPersonas,img } = req.body;

  if (!titulo || !ingredientes || !preparacion || nPersonas || !img) {
    res
      .status(401)
      .json({ errorMessage: "Todos los campos deben estar rellenos" });
    return;
  }

  try {
    await Receta.create({
      titulo,
      ingredientes,
      preparacion,
      nPersonas,
      autor: req.payload._id,
      img,
    });

    res.json("Receta creada correctamente");
  } catch (error) {
    next(error);
  }
});

//todo -----GET ("api/receta/recetaId") => Devuelve las recetas creadas por un user
router.get("/recetaId", async (req, res, next) => {
  const { _id } = req.payload;
  try {
    const response = await Receta.find({ autor: _id });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

//todo ------PACH ("api/receta/update")=> Actualiza una receta
router.patch("/:idReceta/update", async (req, res, next) => {
  const { idReceta } = req.params;
  const { titulo, ingredientes, preparacion, img } = req.body;
  if(!titulo || !ingredientes || !preparacion || !img){
    res.status(401).json({message: "Todos los campos deben estar rellenos"});
    return;
  }
  try {
    const response = await Receta.findByIdAndUpdate(idReceta, {
      titulo,
      ingredientes,
      preparacion,
      img
    });
    res.json("Receta actualizada correctamente")
  } catch (error) {
    next(error);
  }
});

//todo ------DELETE("api/receta/delete")=> Elimina una receta de la BD
router.delete("/:idReceta/delete", async (req, res, next) => {
  const { idReceta } = req.params;
  try {
    await Receta.findByIdAndDelete(idReceta);
    res.json("Receta eliminada");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
