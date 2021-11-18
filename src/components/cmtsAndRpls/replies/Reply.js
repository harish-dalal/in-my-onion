import React , { Component } from 'react'
import Profile from '../../profilePic/ProfilePic'
import firebase from 'firebase'
import {FirebaseContext} from '../../API/firebase'
import Vote from '../../helper/vote'
import './reply.css'

class Reply extends Component{
    constructor(props){
        super(props)
        // props => data(reply data) , questId , commentId , key(replyId)  , signed
        this.state = {
            showReplies : false,
            upVoted : false,
            downVoted : false,
            upVote : 0,
            downVote : 0,
            user : {},
        }
        this.Vote = new Vote();
    }

    deleteReply(){
        let batch = this.context.db.batch()
        let ref = this.context.db.collection('Quest').doc(this.props.questId).collection('Comments').doc(this.props.commentId).collection('Replies').doc(this.props.data.replyId)
        
        batch.delete(ref)
        let incRef = this.context.db.collection('Quest').doc(this.props.questId).collection('Comments').doc(this.props.commentId)
        batch.update(incRef , {
            ...({totalReplies : firebase.firestore.FieldValue.increment(-1)})
        })

        batch.commit().then(()=>console.log('deleted')).catch(err=>console.log(err + ' in deletion'))
    }

    getVotes(){
        //getting upvotes snapshot
        //Todo to remove the conditoin tot check the user value inside OBkectjs.keys
        this.unsubscribeUp = this.context.db.collection('Quest_data').doc(this.props.data.replyId).collection('upVotes').doc(`upVote_${this.props.data.replyId}`)
        .onSnapshot(snap=>{
            let data = snap.data();
            if(typeof data!=='undefined'){
                data = data.user
                let lenData = typeof data !== 'undefined' ? Object.getOwnPropertyNames(data).length : 0;
                let user = null
                if(this.props.signed){
                    user = this.context.auth.currentUser.uid
                    if(lenData!==0) if(data.hasOwnProperty(user)) this.setState({upVoted : true , downVoted : false})
                }
                this.setState({upVote : lenData})
            }
        })

        //getting downvotes snapshot
        this.unsubscribedown = this.context.db.collection('Quest_data').doc(this.props.data.replyId).collection('downVotes').doc(`downVote_${this.props.data.replyId}`)
        .onSnapshot(snap=>{
            let data = snap.data();
            if(typeof data!=='undefined'){
                data = data.user
                let lenData = typeof data !== 'undefined' ? Object.getOwnPropertyNames(data).length : 0;
                let user = null
                if(this.props.signed){
                    user = this.context.auth.currentUser.uid
                    if(lenData!==0) if(data.hasOwnProperty(user)) this.setState({upVoted : false , downVoted : true})
                }
                this.setState({downVote : lenData})
            }
        })
    }

    componentDidMount(){
        this.context.auth.onAuthStateChanged(u=>{
            if(u!=null) this.setState({user :  u});
            else this.setState({user : null});
        })
        this.getVotes()
        this.vote = new Vote(this.context)
    }

    componentWillUnmount(){
        this.unsubscribedown();
        this.unsubscribeUp();
    }

    render(){
        const Date = this.props.data.timeStamp.toDate().toString().split(' ')
        return(
            <div className = 'reply-box'>
                <div className = 'profile-box-reply'>
                    <div style = {{height : '18px' , width : '18px'}}><Profile imageUrl = {this.props.data.user.userProfilePicUrl}/></div>
                    <div style= {{display : 'flex' , flexDirection : 'row'}}>
                        <p>{this.props.data.user.userName}</p>
                        <p className = 'date'><span style = {{fontWeight : 'bold'}}>&#183;</span>{' ' + Date[2] + ' ' + Date[1] + ' ' + Date[3]+' '}<span style = {{fontWeight : 'bold'}}>&#183;</span>{' '+Date[4].split(':')[0] + ':' + Date[4].split(':')[1] }</p>
                    </div>
                    {   this.state.user && (this.state.user.uid === this.props.data.user.userId) ?
                        <div className = 'delete-button' onClick ={this.deleteReply.bind(this)}/>
                        : null
                    }
                </div>
                <p>{this.props.data.reply}</p>
                <div className = 'up-down-reply noselect'>
                    <svg width="18px" height="18px" onClick={() =>this.vote.upVote('Reply' , this.props.signed ? this.context.auth.currentUser.uid : null , this.props.data.replyId)} viewBox="0 0 24 24"><g id="upvote" className={'icon-svg'+ (this.props.signed && this.state.upVoted ? ' upvoted' : '')}><polygon points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon></g></svg>
                    <p>{this.state.upVote - this.state.downVote}</p>
                    <svg width="18px" height="18px" onClick={() =>this.vote.downVote('Reply' , this.props.signed ? this.context.auth.currentUser.uid : null , this.props.data.replyId)} viewBox="0 0 24 24"><g id="downvote" className={'icon-svg'+ (this.props.signed && this.state.downVoted ? ' downvoted' : '')}><polygon transform="translate(12.000000, 12.000000) rotate(-180.000000) translate(-12.000000, -12.000000) " points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon></g></svg>
                </div>
                
                <hr/>
            </div>
        )
    }
}

Reply.contextType = FirebaseContext
export default Reply; 