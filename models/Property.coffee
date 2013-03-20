# Out of sync with the more up to date js file
# mongoose = require "../node_modules/mongoose"
# 
# validatePresenceOf = (value) ->
#   value && value.length
#   
# PropertySchema = new mongoose.Schema
#   name:
#     type: String
#     validate: [validatePresenceOf, 'a name is required']
#     index: 
#       unique: true
#   createdOn:
#     type: Date, default: Date.now
#     
# exports.Property = mongoose.model 'Property', PropertySchema, 'property'