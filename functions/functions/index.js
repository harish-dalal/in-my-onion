const functions  = require('firebase-functions');
const admin      = require('firebase-admin');
const fs         = require('fs');

var app = admin.initializeApp();

const db = admin.firestore();

// Getting and replacing meta tags
exports.preRender = functions.https.onRequest((request, response) => {
    
    // Error 404 is false by default
    let error404 = false;
        
    // Getting the path
    const path = request.path ? request.path.split('/') : request.path;

    // Getting index.html text
    let index = fs.readFileSync('./web/index.html').toString();
    let error400 = fs.readFileSync('./web/400.html').toString();
    
    // Changing metas function
    const setMetas = (description) => {
        
        index = index.replace('firebase_meta_description', description);
        
    }
    

    // Navigation menu
    if(path[1] === 'Quest'){
        let questId = path[2].toString()
        if(questId.trim().length !== 0){
            db.collection('Quest').doc(questId).get()
            .then(snap=>{
                // console.log(snap.data())
                if(typeof snap.data() === 'undefined') response.status(400).send(error400)
                setMetas(snap.data().title);
                error404
                ? response.status(400).send(error400)
                : response.status(200).send(index);
            })
            .catch(err=>{
                console.log('error '+err)
                response.status(400).send(index)
            })
        }
        else response.status(400).send(error400)
    }    
    else{
        setMetas('Give your onion on some weird stuff');
        error404
        ? response.status(400).send(error400)
        : response.status(200).send(index);
    }
    
    
    // We need to considerate the routes and a default state to 404 errors as well
    // ...

    
    // Sending index.html    
    
});