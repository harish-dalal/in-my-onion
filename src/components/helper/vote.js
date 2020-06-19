import firebase from 'firebase'
class Vote{
    constructor(cont){
        this.cont = cont
    }

    upVote(type , userId = null , questId , commentId = null , replyId = null){
        if(userId == null){
            console.log('sign in to upvote '+ type)
        }
        else{
            let batch = this.cont.db.batch()
            let upVoteRefUser = this.cont.db.collection('Users_pvt_data').doc(userId).collection('Quest_upVote').doc('upVote_'+userId)
            let downVoteRefUser = this.cont.db.collection('Users_pvt_data').doc(userId).collection('Quest_downVote').doc('downVote_'+userId)
            let questupVote = this.cont.db.collection('Quest_data').doc(questId).collection('upVotes').doc(`upVote_${questId}`)
            let questdownVote = this.cont.db.collection('Quest_data').doc(questId).collection('downVotes').doc(`downVote_${questId}`)

            batch.set(upVoteRefUser , {
                quest : {[questId] : true}
            },{merge : true})
            batch.set(downVoteRefUser , {
                quest : {[questId] : firebase.firestore.FieldValue.delete()}
            },{merge : true})
            batch.set(questupVote , {
                user : {[userId] : true}
            }, { merge : true})
            batch.set(questdownVote , {
                user : {[userId] : firebase.firestore.FieldValue.delete()}
            },{merge : true})
            
            batch.commit().then(()=>console.log('upvoted')).catch(err=>console.log(err))
        }
    }

    downVote(type , userId = null , questId , commentId = null , replyId = null){
        if(userId == null){
            console.log('sign in to downVote '+ type)
        }
        else{
            let batch = this.cont.db.batch()
            let upVoteRefUser = this.cont.db.collection('Users_pvt_data').doc(userId).collection('Quest_upVote').doc('upVote_'+userId)
            let downVoteRefUser = this.cont.db.collection('Users_pvt_data').doc(userId).collection('Quest_downVote').doc('downVote_'+userId)
            let questupVote = this.cont.db.collection('Quest_data').doc(questId).collection('upVotes').doc(`upVote_${questId}`)
            let questdownVote = this.cont.db.collection('Quest_data').doc(questId).collection('downVotes').doc(`downVote_${questId}`)

            batch.set(upVoteRefUser , {
                quest : {[questId] : firebase.firestore.FieldValue.delete()}
            },{merge : true})
            batch.set(downVoteRefUser , {
                quest : {[questId] : true}
            },{merge : true})
            batch.set(questupVote , {
                user : {[userId] : firebase.firestore.FieldValue.delete()}
            }, { merge : true})
            batch.set(questdownVote , {
                user : {[userId] : true}
            },{merge : true})
            
            batch.commit().then(()=>console.log('downvoted')).catch(err=>console.log(err))
        }
    }
}

export default Vote;