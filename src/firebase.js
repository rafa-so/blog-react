import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

let firebaseConfig = {
    apiKey: "AIzaSyAxiD6vqmIM_QA6HXNU7tBOTrdZsWtdNms",
    authDomain: "reactapp-945b5.firebaseapp.com",
    databaseURL: "https://reactapp-945b5.firebaseio.com",
    projectId: "reactapp-945b5",
    storageBucket: "",
    messagingSenderId: "615588689768",
    appId: "1:615588689768:web:76c9956acfdf3604"
};

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);

        this.db = app.database();
    }

    login(email, password) {
        return app.auth()
            .signInWithEmailAndPassword(email, password);
    }

    logout(){
        app.auth().signOut();
    }

    async register(nome, email, password) {
        await app.auth().createUserWithEmailAndPassword(email, password);

        let uid = app.auth().currentUser.uid;

        return app.database().ref('usuarios')
            .child(uid).set({
                nome: nome
            });
    }

    isInitialized(){
        return new Promise(resolve => {
            app.auth().onAuthStateChanged(resolve);
        });
    }

    getCurrent(){
        return app.auth().currentUser && app.auth().currentUser.email
    }

    async getUserName(callback){
        if (!app.auth().currentUser) {
            return null;
        }

        const uid = app.auth().currentUser.uid;

        await app.database().ref('usuarios')
            .child(uid).once('value')
            .then(callback);
    }
}

export default new Firebase();