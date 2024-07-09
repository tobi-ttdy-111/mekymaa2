
// imports
const mongoose = require( 'mongoose' );


// connection
const connection = async() => {

    try {
        await mongoose.connect( process.env.MONGODB_CNN );
        console.log( `Connected database` );
    } catch ( err ) {
        throw new Error( `Failed to connect database \n${ err }` );
    };

};


// exports
module.exports = connection;