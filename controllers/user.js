
// imports
const { request, response } = require( 'express' );
const bcrypjs = require( 'bcryptjs' );
const cloudinary = require( 'cloudinary' );
const User = require( '../database/user' );


// getInit
const getInit = async( req = request, res = response ) => {

    const user = await User.findById( req.user._id );
    const users = await User.find({ status: true });

    res.json({ user, users });

};


// getUser
const getUser = ( req = request, res = response ) => {

    res.json({ user: req.user });

};


// postUser
const postUser = async( req = request, res = response ) => {

    const { email, name, password } = req.body;

    const user = new User({ email, name, password, role: 'user' });
    const salt = bcrypjs.genSaltSync( 10 );
    user.password = bcrypjs.hashSync( password, salt );

    await user.save();
    res.json({ user });

};


// putUserPassword
const putUserPassword = async( req = request, res = response ) => {

    const { actualPassword, newPassword, confirmPassword } = req.body;

    const match = bcrypjs.compareSync( actualPassword, req.user.password );
    if ( !match ) return res.status( 400 ).json({ 'errors': [{ msg: 'La contraseña actual es incorrecta' }] });
    if ( newPassword != confirmPassword ) return res.status( 400 ).json({ 'errors': [{ msg: 'Las contraseñas no coinciden' }] });
    const salt = bcrypjs.genSaltSync( 10 );

    const user = await User.findByIdAndUpdate( req.user.id, { password: bcrypjs.hashSync( newPassword, salt ) } );
    res.json({ user });

};


// putUserData
const putUserData = async( req = request, res = response ) => {

    try {
        const { name } = req.body;
        let img = req.user.img;
        if ( req.files ) {
            if ( img ) {
                const nameArr = img.split( '/' );
                const name = nameArr[ nameArr.length -1 ];
                const [ public_id ] = name.split( '.' );
                cloudinary.uploader.destroy( public_id );
            };
            const { image } = req.files;
            const { secure_url } = await cloudinary.uploader.upload( image.tempFilePath );
            img = secure_url;
        };
        const user = await User.findByIdAndUpdate( req.user._id, { name, img } );
        res.json({ user });
    } catch ( err ) {
        res.status( 400 ).json({ 'errors': [{ msg: 'El tipo de archivo que intentas ingresar no es válido' }] });
    };

};


// deleteUser
const deleteUser = async( req = request, res = response ) => {

    const { password } = req.body;
    const match = bcrypjs.compareSync( password, req.user.password );
    if ( !match ) return res.status( 400 ).json({ 'errors': [{ msg: 'Contraseña incorrecta' }] });

    const user = await User.findByIdAndUpdate( req.user._id, { status: false });
    res.json({ user });

};


// exports
module.exports = {
    getInit,
    getUser,
    postUser,
    putUserPassword,
    putUserData,
    deleteUser
};