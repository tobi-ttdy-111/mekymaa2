
// Users
class Users {


    // constructor
    constructor() {

        this.users = {};
        this.actuals = {};
        this.chats = [];
        this.chats.push({ chat: [ 'general' ], messages: [] });
        this.tails = [];
        this.matchs = [];

    };


    // get
    getUsers() { return Object.values( this.users ) };
    getActuals() { return Object.values( this.actuals ) };
    getGeneral() { return this.chats[ 0 ] }
    getChat( user1, user2 ) {
        let chatsito;
        this.chats.forEach( chat => {
            if ( chat.chat.includes( user1 ) && chat.chat.includes( user2 ) ) {
                chatsito = chat;
            };
        });
        return chatsito;
    };
    getMatchs() { return this.matchs };


    // sendMessage
    sendMessage( message ) {
        let exist = false;
        this.chats.forEach( chat => {
            if ( chat.chat.includes( message.of ) && chat.chat.includes( message.to ) ) {
                chat.messages.push({ name: message.name, message: message.message })
                exist = true;
            };
        });
        if ( exist == false ) {
            const chat = { chat: [ message.of, message.to ], messages: [{ name: message.name, message: message.message }]};
            this.chats.push( chat );
        };
    };

    // sendMessage
    sendGeneral( message ) {
        this.chats.forEach( chat => {
            if ( chat.chat == 'general' ) { chat.messages.push( message ) };
        });
    };


    // conectUser
    conectUser( user ) {
        this.users[ user.id ] = user;
    };


    // putActuals
    putActuals( id, actual ) { this.actuals[ id ] = actual };
    putUsers( id, user ) { this.users[ id ] = user };


    // disconnectUser
    disconnectUser( id ) {
        delete this.users[ id ];
    };
    disconnectActual( id ) {
        delete this.actuals[ id ];
    };


    // tails
    conectTail( user ) {
        this.tails.push( user );
    };
    deleteTails( id ) {
        let newTails = [];
        this.tails.forEach( tail => {
            if ( tail.id != id ) { newTails.push( tail ) };
        });
        this.tails = newTails;
    };


    // matchs
    addMatch( match ) {
        this.matchs.unshift( match );
    };
    deleteMatch( uid ) {
        let newMatchs = [];
        this.matchs.forEach( match => {
            if ( match.uid != uid ) {
                newMatchs.push( match );
            };
        });
        this.matchs = newMatchs;
    };
    connectMatch( user, uid ) {
        this.matchs.forEach( match => {
            if ( match.uid == uid ) {
                match.members.push( user );
            };
        });
    };
    disconnectMatch( user, uid ) {
        this.matchs.forEach( match => {
            if ( match.uid == uid ) {
                let newMembers = [];
                match.members.forEach( member => {
                    if ( member.id != user.id ) { newMembers.push( member ) };
                });
                match.members = newMembers;
            };
        });
    };
    getMatch( uid ) {
        let matchRet;
        this.matchs.forEach( match => {
            if ( match.uid == uid ) {
                matchRet = match
            };
        });
        return matchRet;
    };
    activeMatch( uid ) {
        this.matchs.forEach( match => {
            if ( match.uid == uid ) {
                match.active = true
            };
        });
    };

};


// exports
module.exports = Users;