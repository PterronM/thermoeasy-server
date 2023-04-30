const express = require("express");
const router = express.Router();
const Receta = require("../models/Receta.model.js");
const isAuthenticated = require("../middleware/auth.middleware.js");
const User = require("../models/User.model.js");

//todo -----GET ("/api/receta/allRecetas") => Lista de recetas de BD
router.get("/", async (req, res, next) => {
  try {
    const response = await Receta.find().populate('autor');
    console.log(response.data);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

//todo ------POST ("api/receta/crear-receta") => Crear una receta
router.post("/crear-receta", isAuthenticated, async (req, res, next) => {
  const { titulo, ingredientes, preparacion, nPersonas, img } = req.body;

  if (!titulo || !ingredientes || !preparacion || !nPersonas || !img) {
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
      img
    });

    res.json("Receta creada correctamente");
  } catch (error) {
    next(error);
  }
});

//todo -----GET ("api/receta/recetaUser") => Devuelve las recetas creadas por un user
router.get("/recetaUser", isAuthenticated, async (req, res, next) => {
  try {
    const response = await Receta.find({ autor: req.payload._id });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

//todo---- GET("api/receta/favoritos") => Recetas favoritos del usuario
router.get("/favoritos", isAuthenticated, async (req, res, next) => {
  const actUserId  = req.payload._id;

  try {
    const response = await User.findById(actUserId)
      .select("favoritos")
      .populate("favoritos");
    const ordenArr = response.favoritos.sort((a, b) => {
      return new Date(b.updateAt).getTime() - new Date(a.updatedAt).getTime();
    });
    res.status(200).json(ordenArr);
  } catch (error) {
    next(error);
  }
});

//todo---- GET ("api/receta/:idReceta") => Detalles de una Receta
router.get("/:idReceta", isAuthenticated, async (req, res, next) => {
  const { idReceta } = req.params;
  try {
    const user = await User.findById(req.payload._id).select("favoritos");
    const response = await Receta.findById(idReceta).populate("autor");
    res.status(200).json([response,user]);
  } catch (error) {
    next(error);
  }
});

//todo ------PACH ("api/receta/:idReceta/update")=> Actualiza una receta
router.patch("/:idReceta/update", isAuthenticated,async (req, res, next) => {
  const { idReceta } = req.params;
  const { titulo,ingredientes, preparacion,nPersonas, img } = req.body;

  if (!titulo || !preparacion || !nPersonas|| !ingredientes ) {
    res.status(401).json({ message: "Todos los campos deben estar rellenos" });
    return;
  }
  try {
    const response = await Receta.findByIdAndUpdate(idReceta, {
      titulo,
      preparacion,
      nPersonas,
      ingredientes,
      preparacion,
      img,
    });
    res.json("Receta actualizada correctamente");
  } catch (error) {
    next(error);
  }
});

//todo ------DELETE("api/receta/:idReceta/delete")=> Elimina una receta de la BD
router.delete("/:idReceta/delete", isAuthenticated,async (req, res, next) => {
  const { idReceta } = req.params;
  try {
    await Receta.findByIdAndDelete(idReceta);
    res.json("Receta eliminada");
  } catch (error) {
    next(error);
  }
});

//todo------ PACH ("api/receta/:idReceta/favorito")Añadir/Eliminar favorito un anuncio
router.patch("/:idReceta/favorito", isAuthenticated, async (req, res, next) => {
  const { fav, notFav } = req.body;
  const activeUSerId = req.payload._id;
  try {
    if (fav) {
      await User.findByIdAndUpdate(activeUSerId, {
        $push: { favoritos: fav },
      });
      res.status(202).json("favorito añadido");
    }
    if (notFav) {
      await User.findByIdAndUpdate(activeUSerId, {
        $pull: { favoritos: notFav },
      });
      res.status(202).json("favorito eliminado");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
