
const emailSignup = document.querySelector( '#emailSignup' );
const nameSignup = document.querySelector( '#nameSignup' );
const passwordSignup = document.querySelector( '#passwordSignup' );
const submitSignup = document.querySelector( '#submitSignup' );

const emailLogin = document.querySelector( '#emailLogin' );
const passwordLogin = document.querySelector( '#passwordLogin' );
const submitLogin = document.querySelector( '#submitLogin' );

submitSignup.addEventListener( 'click', async( e ) => {
    e.preventDefault();
    await fetch( `${ domain }/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'email': emailSignup.value,
            'name': nameSignup.value,
            'password': passwordSignup.value
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
                    <small>Cuenta creada exitosamente <br> </small>
                    <div class="actions">
                        <input type="button" value="Aceptar" class="success all" id="ocultMessage">
                    </div>
                </form>
            `, undefined, 'ocultMessage', undefined, 'loginComponent' );
        };
    });
});

submitLogin.addEventListener( 'click', async( e ) => {
    e.preventDefault();
    await fetch( `${ domain }/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'email': emailLogin.value,
            'password': passwordLogin.value
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
            localStorage.setItem( 'token', data.token );
            localStorage.setItem( 'user', JSON.stringify( data.user ) );
            window.location = './index.html';
        };
    });
});