const CV = require("../models/CV")

const singleCV = async (req, res, next) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No CV file uploaded"
            })
        }

        const cv = await CV.create({
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: req.file.path,
            fileSize: req.file.size,
            fileType: req.file.mimetype,
            status: "pending"
        })

        res.status(201).json({
            success: true,
            message: "CV uploaded successfully",
            cv
        })

    } catch (error) {
        next(error)
    }
}


const multipleCVs = async (req, res, next) => {
    try {

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No CV files uploaded"
            })
        }

        const cvData = req.files.map((file) => ({
            originalName: file.originalname,
            fileName: file.filename,
            filePath: file.path,
            fileSize: file.size,
            fileType: file.mimetype,
            status: "pending"
        }))

        const cvs = await CV.insertMany(cvData)

        res.status(201).json({
            success: true,
            message: `${cvs.length} CV(s) uploaded successfully`,
            cvs
        })

    } catch (error) {
        next(error)
    }
}

const getCVsByIds = async (req, res, next) => {
    try {
        const { ids } = req.query;

        if (!ids) {
            return res.status(400).json({
                success: false,
                message: "CV IDs are required"
            });
        }

        const cvIds = ids.split(",");

        const cvs = await CV.find({
            _id: { $in: cvIds }
        });

        res.status(200).json({
            success: true,
            cvs
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    singleCV,
    multipleCVs,
    getCVsByIds
}