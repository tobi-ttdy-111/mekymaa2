
// imports
const { Router } = require( 'express' );
const { check } = require('express-validator');
const { postMatch } = require('../controllers/match');
const { validateJwt } = require( '../middlewares/validateJwt' );
const { validateReq } = require( '../middlewares/validateReq' );


// router
const router = Router();


// post /match
router.post( '/match', [
    validateJwt,
    check( 'type', '¿Qué tipo de partida jugaste?' ).notEmpty(),
    check( 'rank', 'Tu posicion debe de ser un número' ).notEmpty(),
    check( 'date', 'La fecha de juego es obligatoria' ).notEmpty(),
    check( 'ppm', 'Tus palabras por minuto no son válidas' ).notEmpty(),
    validateReq
], postMatch );


// exports
module.exports = router;