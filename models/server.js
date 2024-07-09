
// imports
const express = require( 'express' );
const { createServer } = require( 'http' );
const fileUpload = require( 'express-fileupload' );
const connection = require( '../database/connection' );
const { socketController } = require( '../sockets/controller' );


// Server
class Server {


    // constructor
    constructor() {

        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer( this.app );
        this.io = require( 'socket.io' )( this.server );
        this.dbConnection();
        this.middlewares();
        this.routes();
        this.sockets();

    };


    // dbConnection
    async dbConnection() {

        await connection();

    };


    // middlewares
    middlewares() {

        this.app.use( express.static( 'public' ) );
        this.app.use( express.json() );
        this.app.use( fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));

    };


    // routes
    routes() {

        this.app.use( require( '../routes/user' ) );
        this.app.use( require( '../routes/auth' ) );
        this.app.use( require( '../routes/ranking' ) );
        this.app.use( require( '../routes/friend' ) );
        this.app.use( require( '../routes/match' ) );

    };


    // sockets
    sockets() {

        this.io.on( 'connection', ( socket ) => socketController( socket, this.io ) )

    };


    // listen
    listen() {

        this.server.listen( this.port, () => {
            console.log( `Listening on port ${ this.port }` );
        });

    };


};


// exports
module.exports = Server;