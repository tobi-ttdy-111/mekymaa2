
// imports
const { request, response } = require( 'express' );
const jwt = require( 'jsonwebtoken' );
const User = require( '../database/user' );


// validateJwt
const validateJwt = async( req = request, res = response, next ) => {

    const token = req.header( 'token' );
    if ( !token ) return res.status( 400 ).json({ 'errors': [{ msg: 'Hemos perdido la conexion con tu cuenta' }] });

    try {
        const { uid } = jwt.verify( token, process.env.SECRETKEY );
        const user = await User.findById( uid );
        if ( !user ) return res.status( 400 ).json({ 'errors': [{ msg: 'Hemos perdido la conexion con tu cuenta' }] });
        if ( !user.status ) return res.status( 400 ).json({ 'errors': [{ msg: 'Hemos perdido la conexion con tu cuenta' }] });
        req.user = user;
        next();
    } catch ( err ) {
        // console.log( err );
        res.status( 400 ).json({ 'errors': [{ msg: 'Hemos perdido la conexion con tu cuenta' }] });
    };

};


// exports
module.exports = {
    validateJwt
};