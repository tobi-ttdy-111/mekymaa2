
// imports
const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { postAuth } = require( '../controllers/auth' );
const { validateReq } = require( '../middlewares/validateReq' );


// router
const router = Router();


// post /auth
router.post( '/auth', [
    check( 'email', 'Falta el correo' ).notEmpty(),
    check( 'password', 'Introduce tu contraseña' ).notEmpty(),
    validateReq
], postAuth );


// exports
module.exports = router;