# Out of sync with the more up to date js file
# mongoose = require "../node_modules/mongoose"
# 
# validatePresenceOf = (value) ->
#   value && value.length
#   
# OwnerSchema = new mongoose.Schema
#   name:
#     type: String
#   email:
#     type: String 
#     lowercase: true
#     validate: [validatePresenceOf, 'an email is required']
#     index: 
#       unique: true
#   password: String
#   salt: String
#   createdOn:
#     type: Date, default: Date.now
#     
# exports.Owner = mongoose.model 'Owner', OwnerSchema, 'owner'