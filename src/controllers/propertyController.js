const Property = require('../models/propertyModel')
const { resReturn } = require('../utils/responseHelpers')

// add property
exports.addProperty = async (req, res, next) =>{
    try {
        const property = await Property.create(req.body)
        return resReturn(res, 201, {property})
    } catch (error) {
        return resReturn(res, 500, {error: error.message})
    }
} 


// get all properties
exports.getAllProperties = async (req, res, next) => {
    try {
        const properties = await Property.find()
        return resReturn(res, 200, {properties})
    } catch (error) {
        return resReturn(res, 500, {error: error.message})
    }
}