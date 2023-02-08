const jwksRsa = require('jwks-rsa')
const { expressjwt: expressJwt } = require('express-jwt')
const { auth0 } = require('../config/config')

const jwtCheck = expressJwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${auth0.issuer}.well-known/jwks.json`
    }),
    audience: auth0.audience,
    issuer: auth0.issuer,
    algorithms: ['RS256'] 
})

module.exports = { jwtCheck }