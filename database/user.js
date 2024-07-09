
// imports
const { Schema, model } = require( 'mongoose' );


// schemaUser
const schemaUser = new Schema({


    email: {
        type: String,
        required: [ true, 'Email is required' ],
        unique: true
    },


    name: {
        type: String,
        required: [ true, 'Name is required' ]
    },


    password: {
        type: String,
        required: [ true, 'Password is required' ]
    },


    role: {
        type: String,
        required: [ true, 'Role is required' ]
    },


    img: {
        type: String
    },


    status: {
        type: Boolean,
        default: true
    },


    ppm: {
        type: Number,
        default: 0
    },


    winrate: {
        type: Number,
        default: 0
    },


    mp: {
        type: Number,
        default: 100
    },


    history: {
        type: Array
    },


    friends: {
        type: Array
    },


    slopes: {
        type: Array
    }


});


// exports
module.exports = model( 'user', schemaUser );