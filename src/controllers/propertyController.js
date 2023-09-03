const Property = require('../models/propertyModel')
const { resReturn } = require('../utils/responseHelpers')

exports.addProperty = async (req, res, next) =>{
    try {
        const property = await Property.create(req.body)
        return resReturn(res, 201, {property})
    } catch (error) {
        return resReturn(res, 500, {error: error.message})
    }
} 