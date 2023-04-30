const router = require ("express").Router()
const uploader = require("../middleware/cloudinary.config")

router.post("/", uploader.array("files",4) ,(req,res,next)=>{
    res.json({img:req.file.path})
} )

module.exports = router;