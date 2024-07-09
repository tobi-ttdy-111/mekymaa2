
// imports
const jwt = require( 'jsonwebtoken' );


// generateJwt
const generateJwt = async( uid = '' ) => {
    return new Promise( ( resolve, reject ) => {

        const payload = { uid };
        jwt.sign( payload, process.env.SECRETKEY, {
            expiresIn: '3d'
        }, ( err, token ) => {
            if ( err ) {
                console.log( err );
                reject( 'No se pudo generar el token' );
            } else {
                resolve( token );
            };
        });

    });
};


// exports
module.exports = {
    generateJwt
};
