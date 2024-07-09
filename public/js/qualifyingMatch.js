
const token = localStorage.getItem( 'token' );
let user;try {user = JSON.parse( localStorage.getItem( 'user' ) );} catch ( err ) { window.location = './account.html';removeItem( 'token' );localStorage.removeItem( 'user' );};
if ( !token || !user ) {window.location = './account.html';removeItem( 'token' );localStorage.removeItem( 'user' );};

const profileUser = document.querySelector( '#profileUser' );const renderProfile = ( user ) => {if ( user.img ) {profileUser.innerHTML = `<div class="info"><p>Hola, <b>${ user.name }</b></p><small class="small-text">Binvenido!</small></div><div class="profile-photo"><div><img src="${ user.img }"></div></div>`;} else {profileUser.innerHTML = `<div class="info"><p>Hola, <b>${ user.name }</b></p><small class="small-text">¿Ya estás preparado?</small></div><span class="people"></span>`;};};renderProfile( user );

const validateUser = async() => {await fetch( `${ domain }/user`, {method: 'GET',headers: { 'Content-Type': 'application/json', token },}).then( res => res.json() ).then( data => {if ( data.errors ) {let msgs = '';data.errors.forEach( err => { msgs += `<small>${ err.msg }</small><br>` });createMessage(`<form>${ msgs }<div class="actions"><input type="button" value="Restaurar conexion" class="danger all" id="ocultMessage"></div></form>`, 'err', 'ocultMessage', './account.html', undefined );localStorage.removeItem( 'token' );localStorage.removeItem( 'user' );} else { if ( data.user != user ) { renderProfile( data.user ); localStorage.setItem( 'user', JSON.stringify( data.user ) ); user = data.user; socketConnection()}};});};validateUser();
const pvp = localStorage.getItem( 'pvp' );
const text = localStorage.getItem( 'text' );
// localStorage.setItem( 'pvp', '' );
// localStorage.setItem( 'text', '' );
let user1 = {};
let user2 = { name: user.name, phrases: 0 };
let timeUser1;
let timeUser2;
let eval = false;
let ppmOponent;


let socket = null;
const socketConnection = () => {

    socket = io({ 'extraHeaders': { 'token': localStorage.getItem( 'token' ), 'actual': 'En clasificatoria' }});

    socket.emit( 'phrasesQualify', { to: pvp, phrases: 0, user });
    socket.on( 'phrasesQualify', ( payload ) => {
        user1.name = payload.user.name;
        user1.phrases = payload.phrases;
        renderRank( user1, user2 );
    });
    socket.on( 'finishQuialify', async( payload ) => {
        if ( payload.user.name == user.name ) { timeUser2 = payload.date } else { timeUser1 = payload.date; ppmOponent = payload.ppm };
        if ( timeUser1 ) {
            console.log( 'has perido' );
        } else {
            console.log( 'has ganado' )
            if ( !eval ) {
                await fetch( `${ domain }/match`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', token },
                    body: JSON.stringify({
                        'type': 'Partida clasificatoria',
                        'rank': 1,
                        'date': new Date().toDateString(),
                        'ppm': payload.ppm,
                        'mp': 20
                    })
                })
                .then( res => res.json() )
                .then( data => {
                    if ( data.errors ) {
                        let msgs = '';
                        data.errors.forEach( err => { msgs += `<small>${ err.msg }</small><br>` });
                        createMessage(`<form><small>Ocurrio un error al guardar en tu historial esta partida</small><div class="actions"><input type="button" value="Regresar" class="danger all" id="ocultMessage"></div></form>`, 'err', 'ocultMessage', './index.html', undefined );
                    } else {
                        createMessage(`<form><small><h2 class="success">> > > VICTORIA < < <</h2><br>Felicidades ganaste + 20mp<br>Has hecho: ${ payload.ppm } ppm</small><div class="actions"><input type="button" value="Regresar" class="success all" id="ocultMessage"></div></form>`, 'err', 'ocultMessage', './index.html', undefined );
                    };
                });
            };
        };
    });

};


// keyboard
const key = document.querySelectorAll( '.key' );
const teclaPresionada = ( e ) => {
    for (let i = 0; i < key.length; i++) {
        if ( e.keyCode == key[ i ].dataset.keyCode ) {
            key[ i ].style.background = color1 || '#7380ec';
            key[ i ].style.color = 'var(--color-background)';
            key[ i ].style.border = 'none';
        };
    };
};
const teclaAlzada = () => {
    for (let i = 0; i < key.length; i++) {
        key[ i ].style.background = 'transparent';
        key[ i ].style.color = 'var(--color-dark)';
        key[ i ].style.border = '1.5px solid var(--color-dark)';
    };
};
document.addEventListener( 'keydown', ( e ) => teclaPresionada( e ));
document.addEventListener( 'keyup', ( ) => teclaAlzada( ));


// preload
let preloadLogo = document.querySelector( '#preloadLogo' );
const preload = document.querySelector( '.preload' );
const here = document.querySelector( '#here' );
const opps = document.querySelector( '#opps' );
const consejos = [
    'Sabías que javaScript es mejor que java'
];
const number = parseInt( Math.random() * ( consejos.length - 0 ) );
here.innerHTML = consejos[ number ];
const preloadAnimation = () => {
    TweenMax.to( preload, 1, {
        delay: 0,
        top: "-100%",
        ease: Expo.easeInOut
    });
};
preloadAnimation();
if ( tema != 'dark' ) preloadLogo.src = './img/logoTop.png';


// main variables
const textHtml = document.querySelector( '#text' );
const texto = text.split( ',' );

// textoFormado
let textoFormado = '';
texto.forEach( palabra => {
    textoFormado += palabra
});
textHtml.innerHTML = textoFormado;


// textoDesestructurado
const textoDesestructurado = Array.from( textoFormado );
let totalLetras = textoDesestructurado.length;
const parcialLetras = textoDesestructurado.length;
let textoCompletado = '';
let timeInicio;
let phrases = 0;





const rank1 = document.querySelector( '#rank1' );
const rank2 = document.querySelector( '#rank2' );
const mePhrases = document.querySelector( '#mePhrases' );
const oponentPhrases = document.querySelector( '#oponentPhrases' );


// {
//     name: 'asdasd',
//     phrases: 0
// }

const renderRank = ( user1, user2 ) => {

    if ( user1.phrases >= user2.phrases ) {
        rank2.innerHTML = `#2 ${ user2.name }`;
        rank2.classList.add( 'success' );
        mePhrases.innerHTML = `Total palabras ${ user2.name } ${ user2.phrases }/40`;
        if ( user1.name ) {
            rank1.innerHTML = `#1 ${ user1.name }`;
            rank1.classList.remove( 'success' );
            oponentPhrases.innerHTML = `Total palabras ${ user1.name } ${ user1.phrases }/40`;
        }
    } else {
        rank1.innerHTML = `#1 ${ user2.name }`;
        rank1.classList.add( 'success' );
        mePhrases.innerHTML = `Total palabras ${ user2.name } ${ user2.phrases }/40`;
        if ( user1.name ) {
            rank2.innerHTML = `#2 ${ user1.name }`;
            oponentPhrases.innerHTML = `Total palabras ${ user1.name } ${ user1.phrases }/40`;
            rank2.classList.remove( 'success' );
        };
    };

};
window.addEventListener( 'keypress', async( e ) => {
    if ( totalLetras == parcialLetras ) { timeInicio = new Date() };
    let key = e.key.toLocaleLowerCase(); let textoNuevo = '';
    if ( key == textoDesestructurado[ 0 ] ) {
        textoCompletado += textoDesestructurado[ 0 ]
        textoDesestructurado.shift();
        textoDesestructurado.forEach( palabra => textoNuevo += palabra );
        textHtml.innerHTML = `<span class="success" style="background: var( --color3 )">${ textoCompletado }</span>${ textoNuevo }`
        totalLetras -= 1;
        if ( e.keyCode == 32 ) {
            phrases += 1;
            user2.phrases = phrases;
            renderRank( user1, user2 );
            socket.emit( 'phrasesQualify', { to: pvp, phrases, user });
        };
    };
    if ( totalLetras == 1 ) {
        socket.emit( 'phrasesQualify', { to: pvp, phrases: 40, user });
        let tiempoFin = new Date();
        const tiempoTotal = ( ( tiempoFin - timeInicio ) / 1000 ) / 60;
        const ppm = parseInt( 39 / tiempoTotal );
        socket.emit( 'finishQuialify', { user, ppm, tiempoTotal, to: pvp });
        if ( !eval && ppmOponent ) {
            eval = true;
            await fetch( `${ domain }/match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', token },
                body: JSON.stringify({
                    'type': 'Partida clasificatoria',
                    'rank': 2,
                    'date': new Date().toDateString(),
                    'ppm': ppm,
                    'mp': -15
                })
            })
            .then( res => res.json() )
            .then( data => {
                if ( data.errors ) {
                    let msgs = '';
                    data.errors.forEach( err => { msgs += `<small>${ err.msg }</small><br>` });
                    createMessage(`<form><small>Ocurrio un error al guardar en tu historial esta partida</small><div class="actions"><input type="button" value="Regresar" class="danger all" id="ocultMessage"></div></form>`, 'err', 'ocultMessage', './index.html', undefined );
                } else {
                    createMessage(`<form><small><h2 class="danger">> > > DERROTA < < <</h2><br>Esta ves has perdido - 15mp<br>Con un total de: ${ ppm } ppm<br>Tu oponente a terminado antes</small><div class="actions"><input type="button" value="Regresar" class="danger all" id="ocultMessage"></div></form>`, 'err', 'ocultMessage', './index.html', undefined );
                };
            });
        }
    };
});


const exitMatch = document.querySelector( '#exitMatch' );
exitMatch.addEventListener( 'click', () => {
    createMessage(`<form><small>¿Estas seguro?</small><br><small>Esta partida no se registrará en tu historial</small><div class="actions"><input type="button" value="Abandonar" class="danger all" id="ocultMessage"></div></form>`, undefined, 'ocultMessage', './index.html', undefined );
});