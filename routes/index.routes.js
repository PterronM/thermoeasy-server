const express = require("express");
const router = express.Router();


router.get("/", (req, res, next) => {
  res.json("All good in here");
});


router.use("/auth", require('./auth.routes.js'));

router.use("/user", require('./user.routes.js'))

router.use("/receta", require('./receta.routes.js'))

router.use("/upload", require('./upload.routes.js'))

module.exports = router;
