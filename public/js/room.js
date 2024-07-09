
const token = localStorage.getItem( 'token' );
let user;try {user = JSON.parse( localStorage.getItem( 'user' ) );} catch ( err ) { window.location = './account.html';removeItem( 'token' );localStorage.removeItem( 'user' );};
if ( !token || !user ) {window.location = './account.html';removeItem( 'token' );localStorage.removeItem( 'user' );};

const profileUser = document.querySelector( '#profileUser' );
const renderProfile = ( user ) => {if ( user.img ) {profileUser.innerHTML = `<div class="info"><p>Hola, <b>${ user.name }</b></p><small class="small-text">Binvenido!</small></div><div class="profile-photo"><div><img src="${ user.img }"></div></div>`;} else {profileUser.innerHTML = `<div class="info"><p>Hola, <b>${ user.name }</b></p><small class="small-text">¿Ya estás preparado?</small></div><span class="people"></span>`;};};
renderProfile( user );

const validateUser = async() => {await fetch( `${ domain }/user`, {method: 'GET',headers: { 'Content-Type': 'application/json', token },}).then( res => res.json() ).then( data => {if ( data.errors ) {let msgs = '';data.errors.forEach( err => { msgs += `<small>${ err.msg }</small><br>` });createMessage(`<form>${ msgs }<div class="actions"><input type="button" value="Restaurar conexion" class="danger all" id="ocultMessage"></div></form>`, 'err', 'ocultMessage', './account.html', undefined );localStorage.removeItem( 'token' );localStorage.removeItem( 'user' );} else { if ( data.user != user ) { renderProfile( data.user ); localStorage.setItem( 'user', JSON.stringify( data.user ) ); user = data.user; socketConnection()}};});};validateUser();


const match = localStorage.getItem( 'match' );
let ultMessage;


const uid = document.querySelector( '#uid' );
const nameMatch = document.querySelector( '#nameMatch' );
const totalMembers = document.querySelector( '#totalMembers' );
uid.innerHTML = `Sala ${ match }`;

let socket = null;
const socketConnection = () => {

    socket = io({ 'extraHeaders': { 'token': localStorage.getItem( 'token' ), 'actual': 'En sala', 'match': match }});

    socket.on( 'matchInfo', ( payload ) => {
        totalMembers.innerHTML = `Jugadores en sala ${ payload.members.length }/10`
        renderListFriends( payload.members, payload.owner );
        nameMatch.innerHTML = `Nombre de la sala: ${ payload.name }`;
    });

    socket.on( 'regrese', () => window.location = './index.html' );

    socket.on( 'sendMatchM', ( payload ) => {
        chat.innerHTML += `
            <div class="msg">
                <p>Jugador: <span class="player ${ aleatoryColor() }">${ payload.name }</span></p>
                <p>${ payload.message }</p>
            </div>
        `;
        chat.scrollTop = 100000000000;
        ultMessage = payload;

    });

    socket.on( 'startMatch', ( payload ) => {
        localStorage.setItem( 'text', payload );
        window.location = './normalMatch.html';
    });

};


// aleatoryColor
const aleatoryColor = () => {
    const random = parseInt( Math.random() * ( 4 - 1 ) + 1 );
    switch ( random ) {
        case 1: return 'primary';
        case 2: return 'success';
        case 3: return 'danger';
    };
};


const friendsUser = document.querySelector( '#friendsUser' );
const validateFriendImg = ( img, mensajes ) => {if ( !img ) { if ( !mensajes ) { return `<span class="people"></span>` } else { return `<span class="people"><div class="uy"></div></span>` }};if ( img ) { if ( !mensajes ) { return `<div class="imgFriend"><img src="${ img }" alt="example"></div>` } else { return `<div class="imgFriend"><img src="${ img }" alt="example"><div class="uy"></div></div>` }  }};

const renderListFriends = ( listFriends, owner ) => {
    friendsUser.innerHTML = '';
    listFriends.forEach( friend => {
        if ( JSON.stringify( friend ) != JSON.stringify( user ) ) {
            try {
                friendsUser.innerHTML += `
                <div class="item online friend" style="cursor: pointer;" id="${ friend._id }">
                    ${ validateFriendImg( friend.img, undefined ) }
                    <div class="right">
                        <div class="info">
                            <h3 class="name">${ friend.name }</h3>
                            <small class="small-text">Listo para comenzar</small>
                        </div>
                        <h3 class="success"> ${ friend.mp } mp</h3>
                    </div>
                </div>
            `;
            } catch ( err ) {};
        };
    });
    if ( JSON.stringify( owner ) == JSON.stringify( user ) ) {
        friendsUser.innerHTML += `
        <div class="item add-people" style="cursor: pointer;" id="startMatch">
            <div>
                <span class="material-icons-sharp">play_arrow</span>
                <h3>Iniciar partida</h3>
            </div>
        </div>`;
        document.querySelector( '#startMatch' ).addEventListener( 'click', () => {
            socket.emit( 'startMatch', ( match ) );
        });
    };
};


const chat = document.querySelector( '#chat' );
const message = document.querySelector( '#message' );
window.addEventListener( 'keypress', ( e ) => {
    if ( e.keyCode == 13 && message.value.trim().length > 0 ) {
        const payload = { of: user._id, to: match, name: user.name, message: message.value }
        if ( JSON.stringify( ultMessage ) !== JSON.stringify( payload ) ) {
            socket.emit( 'sendMatchM', payload );
            message.value = '';
        };
    };
})