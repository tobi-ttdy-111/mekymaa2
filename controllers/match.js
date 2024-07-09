
// imports
const { request, response } = require( 'express' );
const User = require( '../database/user' );


// postMatch
const postMatch = async( req = request, res = response ) => {

    const { type, rank, date, ppm, mp } = req.body;
    const history = req.user.history;

    let sumaPpm = 0;
    history.forEach( match => sumaPpm += match.ppm );
    sumaPpm += ppm;
    const ppmUser = parseInt( sumaPpm / ( history.length + 1 ) );

    if ( history.length >= 21 ) { history.shift() };
    history.unshift({ type, rank, date, ppm });

    let newMp = req.user.mp;
    if ( mp ) { newMp = newMp + mp };

    let newWinrate = req.user.winrate;
    if ( type == 'Partida clasificatoria' ) {
        newWinrate = 0;
        let sumaRank = 0;
        let totalClasifs = 0;
        history.forEach( match => {
            if ( match.type == 'Partida clasificatoria' || match.type == 'Partida normal' ) {
                if ( match.rank != 1 ) {
                    sumaRank += 2;
                } else {
                    sumaRank += match.rank;
                };
                totalClasifs += 1;
            };
        });
        totalClasifs += 1;
        sumaRank += rank;
        newWinrate = parseInt( ( ( sumaRank / totalClasifs ) - 2 ) * ( -100 ) );
    };

    const user = await User.findByIdAndUpdate( req.user.id, ({ history, ppm: ppmUser, winrate: newWinrate, mp: newMp }));
    res.json({ user });

};


// exports
module.exports = {
    postMatch
};