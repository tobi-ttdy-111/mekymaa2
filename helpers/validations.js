
// imports
const User = require( '../database/user' );


// existsEmail
const existsEmail = async( email ) => {

    const exists = await User.findOne({ email });
    if ( exists ) throw new Error( `El correo ya está en uso` );

};


// exports
module.exports = {
    existsEmail
};