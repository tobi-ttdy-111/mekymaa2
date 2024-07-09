
// imports
const { Router } = require( 'express' );
const { getRanking } = require( '../controllers/ranking' );
const { validateJwt } = require( '../middlewares/validateJwt' );


// router
const router = Router();


// get /ranking
router.get( '/ranking', validateJwt, getRanking );


// exports
module.exports = router;