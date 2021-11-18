import firebase from 'firebase'

class bookmark{
    constructor(cont){
        this.cont = cont
    }

    setBookmarkToggle(userId = null , questId , bookmarked){
        console.log('setbbo')
        if(userId == null){
            console.log('sigin to bookmark');
            return
        }
        
        if(!bookmarked){
            let ref = this.cont.db.collection('Users_pvt_data').doc(userId).collection('Quest_bookmark').doc(`bookmark_${userId}`)
            ref.set({
                quest : {[questId] : firebase.firestore.Timestamp.now()}
            },{merge : true}).then(()=>{
                console.log('success in bookmark')
            }).catch(er=>console.log('error in bookmark' + er));
        }

        else{
            let ref = this.cont.db.collection('Users_pvt_data').doc(userId).collection('Quest_bookmark').doc(`bookmark_${userId}`)
            ref.set({
                quest : {[questId] : firebase.firestore.FieldValue.delete()}
            },{merge : true}).then(()=>{
                console.log('success in removing bookmark')
            }).catch(er=>console.log('error in bookmark' + er));    
        }
    }
}

export default bookmark