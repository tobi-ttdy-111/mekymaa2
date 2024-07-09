
// imports
const { request, response } = require( 'express' );
const user = require('../database/user');
const User = require( '../database/user' );


// getFriend
const getFriend = async( req = request, res = response ) => {

    const slopes = req.user.slopes;
    const friends = req.user.friends;
    let listSlopes = [];
    let listFriends = [];

    const users = await User.find({ status: true });
    slopes.forEach( slope => {
        const user = users.find( user => user.id == slope );
        listSlopes.push( user );
    });
    friends.forEach( friend => {
        const user = users.find( user => user.id == friend );
        listFriends.push( user );
    });

    res.json({ listSlopes, listFriends });

};


// putFriend
const putFriend = async( req = request, res = response ) => {

    const { id } = req.params;

    let user = await User.findById( id );
    if ( !user || !user.status ) { return res.status( 400 ).json({ 'errors': [{ msg: 'No se encontro a ningun jugador' }] }) };
    if ( user.id == req.user._id ) { return res.status( 400 ).json({ 'errors': [{ msg: 'No puedes enviarte una solicitud de amistad a ti mismo' }] }) }
    if ( user.friends.includes( req.user._id ) ) return res.status( 400 ).json({ 'errors': [{ msg: 'El usuario ya se encuentra en tus lista de amigos' }] })
    let { slopes = [] } = user;

    if ( req.user.slopes.includes( id ) ) return res.status( 400 ).json({ 'errors': [{ msg: 'El usuario ya te envio una solicitud de amistad' }] })

    if ( slopes.includes( req.user._id ) ) { return res.status( 400 ).json({ 'errors': [{ msg: 'Ya le has enviado una solicitud a ese jugador ' }] }); }
    slopes.push( req.user._id );

    user = await User.findByIdAndUpdate( id, { slopes })
    res.json({ msg: `Solicitud de amistad enviada a ${ user.name }` });

};


// putFriendS
const putFriendS = async( req = request, res = response ) => {

    const { slope, action } = req.params;
    let friends = req.user.friends;
    let slopes = req.user.slopes;

    if ( !slopes.includes( slope ) ) return res.status( 400 ).json({ 'errors': [{ msg: 'Ocurrio un error en el manejo de la solicitud de amistad - no soli' }] });
    if ( friends.includes( slope ) ) return res.status( 400 ).json({ 'errors': [{ msg: 'Ese jugador esta en tus amigos' }] });
    slopes = slopes.filter( ( slop ) => slop != slope );
    const userF = await User.findById( slope );
    if ( !userF ) return res.status( 400 ).json({ 'errors': [{ msg: 'Ocurrio un error en el manejo de la solicitud de amistad' }] });
    const friendsF = userF.friends;
    if ( action == 'acept' ) {
        friends.push( slope );
        const user = await User.findByIdAndUpdate( req.user._id, { friends, slopes });
        friendsF.push( req.user._id.toString() );
        await User.findByIdAndUpdate( slope, { friends: friendsF });
        res.json({ user });
    };
    if ( action == 'delete' ) {
        const user = await User.findByIdAndUpdate( req.user._id, { slopes });
        res.json({ user });
    };

};


// exports
module.exports = {
    putFriend,
    getFriend,
    putFriendS
};