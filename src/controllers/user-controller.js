const { apiRequest } = require("../utils/ApiClient")

const getProfilePictureUrl = user => {
    if (user?.hasPicture) {
        return apiRequest(`/v1/users/${user.id}/picture`, 'GET', user.api_key, null)
            .then(r => r.blob())
            .then(blob => URL.createObjectURL(blob))
    } else {
        return Promise.resolve(`/assets/nopp.svg`)
    }
}

const removeProfilePicture = (user) => {
    return apiRequest(`/v1/users/${user.id}/picture`, 'DELETE', user.api_key, null)
}

const updateProfilePicture = (user, file) => {
    return apiRequest(`/v1/users/${user.id}/picture`, 'PUT', user.api_key, file)
}

module.exports = {
    getProfilePictureUrl,
    updateProfilePicture,
    removeProfilePicture
}