
// imports
const { request, response } = require( 'express' );
const bcrypjs = require( 'bcryptjs' );
const User = require( '../database/user' );
const { generateJwt } = require( '../helpers/generateJwt' );


// postAuth
const postAuth = async( req = request, res = response ) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if ( !user ) return res.status( 400 ).json({ 'errors': [{ msg: 'Correo / contraseña icorrectos' }] });
        if ( !user.status ) return res.status( 400 ).json({ 'errors': [{ msg: 'Tu cuenta a sido eliminada' }] });
        const match = bcrypjs.compareSync( password, user.password );
        if ( !match ) return res.status( 400 ).json({ 'errors': [{ msg: 'Correo / contraseña icorrectos' }] });
        const token = await generateJwt( user.id );
        res.json({ user, token });
    } catch ( err ) {
        console.log( err );
        res.status( 500 ).json({ 'errors': [{ msg: 'En estos momentos mekymaa se encuentra en mantenimiento, intentalo de nuevo mas tarde' }] });
    };

};


// exports
module.exports = {
    postAuth
};