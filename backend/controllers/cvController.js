//pass file details to frontend
//Upload single CV
const singleCV = (req ,res) =>{
    if(!req.file){
        return res.status(400).json({
            success: false,
            message: "No CV file uploaded"
        })
    }

    res.status(200).json({
        success: true,
        message: "CV uploaded successfully",
        file: {
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: req.file.path,
            fileSize: req.file.size,
            fileType: req.file.mimetype
        }
    })
}

//Upload multiple files
const multipleCVs = (req, res) =>{

    if(!req.files || req.files.length === 0){
        return res.status(400).json({
            success: false,
            message: "No CV files uploaded"
        })
    }

    const files = req.files.map((file) =>({

        originalName: file.originalname,
        fileName: file.filename,
        filePath: file.path,
        fileSize: file.size,
        fileType: file.mimetype
    }))

    res.status(200).json({

        success: true,
        message: `${files.length} CV(s) uploaded successfully`,
        files
    })
}

module.exports = {singleCV, multipleCVs}