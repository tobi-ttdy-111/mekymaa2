
const token = localStorage.getItem( 'token' );
let user;try {user = JSON.parse( localStorage.getItem( 'user' ) );} catch ( err ) { window.location = './account.html';removeItem( 'token' );localStorage.removeItem( 'user' );};
if ( !token || !user ) {window.location = './account.html';removeItem( 'token' );localStorage.removeItem( 'user' );};

const profileUser = document.querySelector( '#profileUser' );const renderProfile = ( user ) => {if ( user.img ) {profileUser.innerHTML = `<div class="info"><p>Hola, <b>${ user.name }</b></p><small class="small-text">Binvenido!</small></div><div class="profile-photo"><div><img src="${ user.img }"></div></div>`;} else {profileUser.innerHTML = `<div class="info"><p>Hola, <b>${ user.name }</b></p><small class="small-text">¿Ya estás preparado?</small></div><span class="people"></span>`;};};renderProfile( user );

const validateUser = async() => {await fetch( `${ domain }/user`, {method: 'GET',headers: { 'Content-Type': 'application/json', token },}).then( res => res.json() ).then( data => {if ( data.errors ) {let msgs = '';data.errors.forEach( err => { msgs += `<small>${ err.msg }</small><br>` });createMessage(`<form>${ msgs }<div class="actions"><input type="button" value="Restaurar conexion" class="danger all" id="ocultMessage"></div></form>`, 'err', 'ocultMessage', './account.html', undefined );localStorage.removeItem( 'token' );localStorage.removeItem( 'user' );} else { if ( data.user != user ) { renderProfile( data.user ); localStorage.setItem( 'user', JSON.stringify( data.user ) ); user = data.user; socketConnection()}};});};validateUser();

const text = localStorage.getItem( 'text' );
const ranks = document.querySelector( '#ranks' );
const match = localStorage.getItem( 'match' );
const phrasesHtml = document.querySelector( '#phrases' );

let membersUwu = [];
let rankedNum = 0;


let socket = null;
const socketConnection = () => {

    socket = io({ 'extraHeaders': { 'token': localStorage.getItem( 'token' ), 'actual': 'En partida', 'match': match  }});

    socket.on( 'matchInfo', ( payload ) => {
        membersUwu = [];
        payload.members.forEach( member => {
            membersUwu.push({ name: member.name, phrases: 0 });
        });
        renderRank();
    });

    socket.on( 'putMember', ( payload ) => {
        membersUwu.forEach( member => {
            if ( member.name == payload.name ) {
                member.phrases = payload.phrases;
            };
        });
        console.log( membersUwu );
        renderRank();
    });

    socket.on( 'finishNormal', async( payload ) => {
        rankedNum += 1;
        console.log( `${ payload.name } a quedado en #${ rankedNum }` );
        console.log( payload );
        if ( payload.id == user._id ) {
            await fetch( `${ domain }/match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', token },
                body: JSON.stringify({
                    'type': 'Partida normal',
                    'rank': rankedNum,
                    'date': new Date().toDateString(),
                    'ppm': payload.ppm,
                })
            })
            .then( res => res.json() )
            .then( data => {
                if ( data.errors ) {
                    let msgs = '';
                    data.errors.forEach( err => { msgs += `<small>${ err.msg }</small><br>` });
                    createMessage(`<form><small>Ocurrio un error al guardar en tu historial esta partida</small><div class="actions"><input type="button" value="Regresar" class="danger all" id="ocultMessage"></div></form>`, 'err', 'ocultMessage', './index.html', undefined );
                } else {
                    createMessage(`<form><small><h2 class="danger">HAS QUEDADO #${ rankedNum }</h2><br>Con un total de: ${ payload.ppm } ppm<br></small><div class="actions"><input type="button" value="Regresar" class="danger all" id="ocultMessage"></div></form>`, 'err', 'ocultMessage', './index.html', undefined );
                };
            });
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


const renderRank = ( ) => {

    const ranking = membersUwu.sort( ( a, b ) => {
        if ( a.phrases > b.phrases ) { return -1 };
        if ( a.phrases < b.phrases ) { return 1 };
        return 0;
    });
    ranks.innerHTML = '';
    phrasesHtml.innerHTML = '';
    let contador = 0;
    ranking.forEach( ranking => {
        contador += 1;
        if ( ranking.name == user.name ) {
            ranks.innerHTML += `
                <p class="success">#${ contador } ${ ranking.name }</p>
            `;
            phrasesHtml.innerHTML += `
                <p class="success">Total palabras ${ ranking.name } ${ ranking.phrases }/40</p>
            `
        } else {
            ranks.innerHTML += `
                <p>#${ contador } ${ ranking.name }</p>
            `;
            phrasesHtml.innerHTML += `
                <p>Total palabras ${ ranking.name } ${ ranking.phrases }/40</p>
            `
        };
    });



};



// keyPress
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
            socket.emit( 'putMember', { name: user.name, phrases, match } )
        };
    };
    if ( totalLetras == 1 ) {
        let tiempoFin = new Date();
        const tiempoTotal = ( ( tiempoFin - timeInicio ) / 1000 ) / 60;
        const ppm = parseInt( 39 / tiempoTotal );
        socket.emit( 'finishNormal', { name: user.name, ppm, match, id: user._id } );
        socket.emit( 'putMember', { name: user.name, phrases: 40, match, id: user._id } );
    };
});


const exitMatch = document.querySelector( '#exitMatch' );
exitMatch.addEventListener( 'click', () => {
    createMessage(`<form><small>¿Estas seguro?</small><br><small>Esta partida no se registrará en tu historial</small><div class="actions"><input type="button" value="Abandonar" class="danger all" id="ocultMessage"></div></form>`, undefined, 'ocultMessage', './index.html', undefined );
});