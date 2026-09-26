const multer = require("multer")
const path = require("path")

//store local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads/CVs")
    },

    //generate unique file name
    filename: (req, file, cb) =>{
        const NewfileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cb(null, NewfileName)
    }
})

//file PDF validations
const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLocaleLowerCase()

    if(extension !== ".pdf"){
        return cb(new Error("Only pdf files are allowed"))
    }

    // if(file.mimetype !== "application/pdf"){
    //     return cb(new Error("Only pdf files are allowed"))
    // }
    cb(null, true)
}

//maximum 5MB
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

module.exports = upload
