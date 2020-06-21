import firebase from 'firebase'
class Vote{
    constructor(cont){
        this.cont = cont
    }

    upVote(type , userId = null , Id , commentId = null , replyId = null){
        if(userId == null){
            console.log('sign in to upvote '+ type)
        }
        else{
            let batch = this.cont.db.batch()
            let upVoteRefUser = this.cont.db.collection('Users_pvt_data').doc(userId).collection(`${type}_upVote`).doc('upVote_'+userId)
            let downVoteRefUser = this.cont.db.collection('Users_pvt_data').doc(userId).collection(`${type}_downVote`).doc('downVote_'+userId)
            let questupVote = this.cont.db.collection('Quest_data').doc(Id).collection('upVotes').doc(`upVote_${Id}`)
            let questdownVote = this.cont.db.collection('Quest_data').doc(Id).collection('downVotes').doc(`downVote_${Id}`)

            batch.set(upVoteRefUser , {
                [type.toLowerCase()] : {[Id] : firebase.firestore.Timestamp.now()}
            },{merge : true})
            batch.set(downVoteRefUser , {
                [type.toLowerCase()] : {[Id] : firebase.firestore.FieldValue.delete()}
            },{merge : true})
            batch.set(questupVote , {
                user : {[userId] : firebase.firestore.Timestamp.now()}
            }, { merge : true})
            batch.set(questdownVote , {
                user : {[userId] : firebase.firestore.FieldValue.delete()}
            },{merge : true})
            
            batch.commit().then(()=>console.log('upvoted')).catch(err=>console.log(err))
        }
    }

    downVote(type , userId = null , Id , commentId = null , replyId = null){
        if(userId == null){
            console.log('sign in to downVote '+ type)
        }
        else{
            let batch = this.cont.db.batch()
            let upVoteRefUser = this.cont.db.collection('Users_pvt_data').doc(userId).collection(`${type}_upVote`).doc('upVote_'+userId)
            let downVoteRefUser = this.cont.db.collection('Users_pvt_data').doc(userId).collection(`${type}_downVote`).doc('downVote_'+userId)
            let questupVote = this.cont.db.collection('Quest_data').doc(Id).collection('upVotes').doc(`upVote_${Id}`)
            let questdownVote = this.cont.db.collection('Quest_data').doc(Id).collection('downVotes').doc(`downVote_${Id}`)

            batch.set(upVoteRefUser , {
                quest : {[Id] : firebase.firestore.FieldValue.delete()}
            },{merge : true})
            batch.set(downVoteRefUser , {
                quest : {[Id] : firebase.firestore.Timestamp.now()}
            },{merge : true})
            batch.set(questupVote , {
                user : {[userId] : firebase.firestore.FieldValue.delete()}
            }, { merge : true})
            batch.set(questdownVote , {
                user : {[userId] : firebase.firestore.Timestamp.now()}
            },{merge : true})
            
            batch.commit().then(()=>console.log('downvoted')).catch(err=>console.log(err))
        }
    }
}

export default Vote;