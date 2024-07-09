
// imports
require( 'dotenv' ).config();
const Server = require( './models/server' );


// server
const server = new Server();
server.listen();