const axios = require("axios")
const FormData = require("form-data")
const fs = require("fs")

const processCV = async (filePath, jobDescription) => {

    const form = new FormData()

    form.append(
        "cv",
        fs.createReadStream(filePath)
    )

    form.append(
        "job_description",
        jobDescription
    )

    const response = await axios.post(
        `${process.env.AI_SERVICE_URL}/api/v1/process-cv`,
        form,
        {
            headers: {
                ...form.getHeaders()
            }
        }
    )

    return response.data
}

module.exports = {
    processCV
}