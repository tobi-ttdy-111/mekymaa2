
// imports
const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { putFriend,
        getFriend,
        putFriendS } = require( '../controllers/friend' );
const { validateJwt } = require( '../middlewares/validateJwt' );
const { validateReq } = require( '../middlewares/validateReq' );


// router
const router = Router();


// get /friend
router.get( '/friend', validateJwt, getFriend );


// put /friend/:id
router.put( '/friend/:id', [
    validateJwt,
    check( 'id', 'No es un id válido' ).isMongoId(),
    validateReq
], putFriend );


// put /friend/:slope/:action
router.put( '/friend/:slope/:action', [
    validateJwt,
    check( 'slope', 'Ocurrio un error en el manejo de la solicitud de amistad' ).isMongoId(),
    check( 'action', 'No se recibió correctamente el manejo de la peticion' ).notEmpty(),
    validateReq
], putFriendS );


// exports
module.exports = router;