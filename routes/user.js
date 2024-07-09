
// imports
const { Router } = require( 'express' );
const { check } = require( 'express-validator' )
const { getInit,
        getUser,
        postUser,
        putUserPassword,
        putUserData,
        deleteUser } = require( '../controllers/user' );
const { validateJwt } = require( '../middlewares/validateJwt' );
const { validateReq } = require( '../middlewares/validateReq' );
const { existsEmail } = require( '../helpers/validations' );


// router
const router = Router();


// get /init
router.get( '/init', validateJwt, getInit )


// get /user
router.get( '/user', validateJwt, getUser );


// post /user
router.post( '/user', [
    check( 'email', 'El correo no es válido' ).isEmail(),
    check( 'email' ).custom( existsEmail ),
    check( 'name', 'Introduce tu nombre' ).notEmpty(),
    check( 'password', 'Contraseña debe ser mayor a 5 carácteres' ).isLength({ min: 6 }),
    validateReq
], postUser );


// put /user/password
router.put( '/user/password', [
    validateJwt,
    check( 'actualPassword', 'Ingresa tu contraseña actual' ).notEmpty(),
    check( 'newPassword', 'Contraseña nueva debe ser mayor a 5 carácteres' ).isLength({ min: 6 }),
    check( 'confirmPassword', 'Confirma la nueva contraseña' ).notEmpty(),
    validateReq
], putUserPassword );


// put /user/data
router.put( '/user/data', [
    validateJwt,
    check( 'name', 'Tu nuevo nombre no puede quedar vacío' ).notEmpty(),
    validateReq
], putUserData );


// delete /user
router.delete( '/user', [
    validateJwt,
    check( 'password', 'Ingresa tu contraseña' ).notEmpty(),
    validateReq
], deleteUser );


// exports
module.exports = router;