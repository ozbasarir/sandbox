# mongoose = require 'mongoose'
# {Owner} = require '../models/Owner'
# 
# dsn = "mongodb://localhost/rental"
# mongoose.connect(dsn, (err) -> throw err if err)
# populateOwners = ->
#   console.log "In populateOwners"
#   peggyData = 
#     name: "Peggy"
#     email: "oz.basarir@gmail.com"
#     password: "urla"
#     salt: "ABAEBCDCBE"
#   peggyOwner = new Owner peggyData
#   console.log peggyOwner
#     
#   peggyOwner.save (err, item) ->
#     console.log "In save function"
#     if err
#       console.log err
#     else
#       console.log item
#       
# populateOwners()