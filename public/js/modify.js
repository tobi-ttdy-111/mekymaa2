
const token = localStorage.getItem( 'token' );
let user;try {user = JSON.parse( localStorage.getItem( 'user' ) );} catch ( err ) { window.location = './account.html';removeItem( 'token' );localStorage.removeItem( 'user' );};
if ( !token || !user ) {window.location = './account.html';removeItem( 'token' );localStorage.removeItem( 'user' );};

const profileUser = document.querySelector( '#profileUser' );const renderProfile = ( user ) => {if ( user.img ) {profileUser.innerHTML = `<div class="info"><p>Hola, <b>${ user.name }</b></p><small class="small-text">Binvenido!</small></div><div class="profile-photo"><div><img src="${ user.img }"></div></div>`;} else {profileUser.innerHTML = `<div class="info"><p>Hola, <b>${ user.name }</b></p><small class="small-text">¿Ya estás preparado?</small></div><span class="people"></span>`;};};renderProfile( user );

const validateUser = async() => {await fetch( `${ domain }/user`, {method: 'GET',headers: { 'Content-Type': 'application/json', token },}).then( res => res.json() ).then( data => {if ( data.errors ) {let msgs = '';data.errors.forEach( err => { msgs += `<small>${ err.msg }</small><br>` });createMessage(`<form>${ msgs }<div class="actions"><input type="button" value="Restaurar conexion" class="danger all" id="ocultMessage"></div></form>`, 'err', 'ocultMessage', './account.html', undefined );localStorage.removeItem( 'token' );localStorage.removeItem( 'user' );} else {socketConnection(); if ( data.user != user ) { renderProfile( data.user ); localStorage.setItem( 'user', JSON.stringify( data.user ) ); user = data.user}};});};validateUser();


let socket = null;
const socketConnection = () => {

    socket = io({ 'extraHeaders': { 'token': localStorage.getItem( 'token' ), 'actual': 'Editando perfil' }});

};


const actualPassword = document.querySelector( '#actualPassword' );
const newPassword = document.querySelector( '#newPassword' );
const confirmPassword = document.querySelector( '#confirmPassword' );
const submitModifyPassword = document.querySelector( '#submitModifyPassword' );

const name = document.querySelector( '#name' );name.value = user.name;
const submitModifyData = document.querySelector( '#submitModifyData' );

const fileLabel = document.querySelector( '#fileLabel' );
file.addEventListener( 'change', () => { const nameFile = file.files[0].name;fileLabel.innerHTML = nameFile;});

submitModifyPassword.addEventListener( 'click', async( e ) => {
    e.preventDefault();
    await fetch( `${ domain }/user/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({
            'actualPassword': actualPassword.value,
            'newPassword': newPassword.value,
            'confirmPassword': confirmPassword.value
        })
    })
    .then( res => res.json() )
    .then( data => {
        if ( data.errors ) {
            let msgs = '';
            data.errors.forEach( err => { msgs += `<small>${ err.msg }</small><br>` });
            createMessage(`
                <form>
                    ${ msgs }
                    <div class="actions">
                        <input type="button" value="Aceptar" class="danger all" id="ocultMessage">
                    </div>
                </form>
            `, undefined, 'ocultMessage', undefined, undefined );
        } else {
            createMessage(`
                <form>
                    <small>Tu contraseña a sido cambiada <br> </small>
                    <div class="actions">
                        <input type="button" value="Aceptar" class="success all" id="ocultMessage">
                    </div>
                </form>
            `, undefined, 'ocultMessage', './index.html', undefined );
        };
    });
});

submitModifyData.addEventListener( 'click', async( e ) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append( 'image', file.files[0] );
    formData.append( 'name', name.value );
    await fetch( `${ domain }/user/data`, {
        method: 'PUT',
        headers: { token },
        body: formData
    })
    .then( res => res.json() )
    .then( async( data ) => {
        if ( data.errors ) {
            let msgs = '';
            data.errors.forEach( err => { msgs += `<small>${ err.msg }</small><br>` });
            createMessage(`
                <form>
                    ${ msgs }
                    <div class="actions">
                        <input type="button" value="Aceptar" class="danger all" id="ocultMessage">
                    </div>
                </form>
            `, undefined, 'ocultMessage', undefined, undefined );
        } else {
            createMessage(`
                <form>
                    <small>Información actualizada<br> </small>
                    <div class="actions">
                        <input type="button" value="Aceptar" class="success all" id="ocultMessage">
                    </div>
                </form>
            `, undefined, 'ocultMessage', './index.html', undefined );
            await fetch( `${ domain }/user`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', token },
            })
            .then( res => res.json() )
            .then( data => {
                localStorage.setItem( 'user', JSON.stringify( data.user ) )
                renderProfile( data.user );
            });
            socket.emit( 'putUser' );
        };
    });
});