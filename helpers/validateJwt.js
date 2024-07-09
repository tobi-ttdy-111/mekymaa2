
// imports
const jwt = require( 'jsonwebtoken' );
const User = require( '../database/user' );


// validateJwt
const validateJwt = async( token = '') => {

    try {
        if( token.length < 10 ) { return null };
        const { uid } = jwt.verify( token, process.env.SECRETKEY );
        const user = await User.findById( uid );
        if ( user ) { if ( user.status ) { return user } else { return null }} else { return null };
    } catch ( err ) {
        return null;
    };

};


// exports
module.exports = { validateJwt };