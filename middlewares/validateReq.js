
// imports
const { request, response } = require( 'express' )
const { validationResult } = require( 'express-validator' );


// validateReq
const validateReq = ( req = request, res = response, next ) => {

    const { errors } = validationResult( req );
    if ( errors.length > 0 ) return res.status( 400 ).json({ errors });
    next();

};


// exports
module.exports = {
    validateReq
};