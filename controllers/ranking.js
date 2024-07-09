
// imports
const { request, response } = require( 'express' );
const User = require( '../database/user' );


// get /ranking
const getRanking = async( req = request, res = response ) => {

    let users = await User.find({ status: true });

    users = users.sort( ( a, b ) => {
        if ( a.mp > b.mp ) { return -1 };
        if ( a.mp < b.mp ) { return 1 };
        return 0;
    });
    const top1 = users[ 0 ];
    const top2 = users[ 1 ];
    const top3 = users[ 2 ];

    res.json({ top1, top2, top3 });

};


// exports
module.exports = {
    getRanking
};