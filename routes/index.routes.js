const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});


const authRoutes = require("./auth.routes.js");
router.use("/auth", authRoutes);

const userRoutes = require("./user.routes.js");
router.use("/user",userRoutes)

const recetaRoutes = require("./receta.routes.js");
router.use("/receta", recetaRoutes)

module.exports = router;
