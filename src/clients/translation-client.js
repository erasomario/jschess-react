const { apiRequest } = require("../utils/ApiClient")

const createTranslation = (key, eng, esp) => {
    return apiRequest(`/v1/translations`, 'POST', null, { key, eng, esp })
}

export {
    createTranslation
}