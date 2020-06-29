import React , { Component } from 'react'
import { FirebaseContext } from '../../API/firebase'
import firebase from 'firebase'
import Vote from '../../helper/vote'
import Profile from '../../profilePic/ProfilePic'
import Replies from '../replies/Replies'
import AddComment from '../AddComment'
import './comnt.css'

class Comnt extends Component{
    constructor(props){
        super(props)
        // props => data(comment data) , questId , key(commentId) , signed
        this.state = {
            user : {},
            showReplies : false,
            addReply : false,
            upVoted : false,
            downVoted : false,
            upVote : 0,
            downVote : 0,
        }
        this.Vote = new Vote(this.context)
        this.repliesToggle = this.repliesToggle.bind(this)
    }

    repliesToggle(value){
        this.setState(prevState=>({showReplies : !prevState.showReplies || value}))
    }

    addReplyToggle(){
        this.setState(prevState=>({addReply : !prevState.addReply}))
    }

    componentDidMount(){
        this.context.auth.onAuthStateChanged(u=>{
            if(u!=null) this.setState({user :  u});
            else this.setState({user : null});
        })
        this.getVotes()
        this.vote = new Vote(this.context)
    }

    deleteComment(){
        let batch = this.context.db.batch()
        let ref = this.context.db.collection('Quest').doc(this.props.questId).collection('Comments').doc(this.props.data.commentId)
        
        batch.delete(ref)
        let incRef = this.context.db.collection('Quest').doc(this.props.questId)
        batch.update(incRef , {
            ...({totalComments : firebase.firestore.FieldValue.increment(-1)})
        })

        batch.commit().then(()=>console.log('deleted')).catch(err=>console.log(err + ' in deletion'))
    }

    getVotes(){
        //getting upvotes snapshot
        //Todo to remove the conditoin tot check the user value inside OBkectjs.keys
        this.unsubscribeUp = this.context.db.collection('Quest_data').doc(this.props.data.commentId).collection('upVotes').doc(`upVote_${this.props.data.commentId}`)
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
        this.unsubscribedown = this.context.db.collection('Quest_data').doc(this.props.data.commentId).collection('downVotes').doc(`downVote_${this.props.data.commentId}`)
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

    componentWillUnmount(){
        this.unsubscribeUp();
        this.unsubscribedown();
    }

    render(){
        const Date = this.props.data.timeStamp.toDate().toString().split(' ')
        return(
            <div className = 'comment-box'>
                <div className = 'profile-box-comment'>
                    <div style = {{height : '20px' , width : '20px'}}><Profile imageUrl = {this.props.data.user.userProfilePicUrl}/></div>
                    <div style= {{display : 'flex' , flexDirection : 'row'}}>
                        <div style={{display : 'flex' , flexDirection : 'column'}}>
                            <p>{this.props.data.user.userName}</p>
                            <p className = 'date'><span style = {{fontWeight : 'bold'}}>&#183;</span>{' ' + Date[2] + ' ' + Date[1] + ' ' + Date[3]+' '}<span style = {{fontWeight : 'bold'}}>&#183;</span>{' '+Date[4].split(':')[0] + ':' + Date[4].split(':')[1] }</p>
                        </div>
                        {   this.state.user && (this.state.user.uid === this.props.data.user.userId) ?
                            <div className = 'delete-button' onClick ={this.deleteComment.bind(this)}/>
                            : null
                        }
                    </div>
                </div>
                <p>{this.props.data.comment}</p>
                <div className = 'up-down-comment noselect'>
                    <svg width="20px" height="20px" onClick={() =>this.vote.upVote('Comment' , this.props.signed ? this.context.auth.currentUser.uid : null , this.props.data.commentId)} viewBox="0 0 24 24"><g id="upvote" className={'icon-svg'+ (this.props.signed && this.state.upVoted ? ' upvoted' : '')}><polygon points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon></g></svg>
                    <p>{this.state.upVote - this.state.downVote}</p>
                    <svg width="20px" height="20px" onClick={() =>this.vote.downVote('Comment' , this.props.signed ? this.context.auth.currentUser.uid : null , this.props.data.commentId)}viewBox="0 0 24 24"><g id="downvote" className={'icon-svg'+ (this.props.signed && this.state.downVoted ? ' downvoted' : '')}><polygon transform="translate(12.000000, 12.000000) rotate(-180.000000) translate(-12.000000, -12.000000) " points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon></g></svg>
                    <div className = 'view-replies noselect' onClick = {()=>this.repliesToggle(false)}>{this.state.showReplies ? 'Hide ' : 'View '}{this.props.data.totalReplies} replies</div>
                    <div className = 'reply noselect' onClick = {this.addReplyToggle.bind(this)}>Reply</div>
                </div>
                
                {this.state.addReply ?
                    <div><AddComment questId = {this.props.questId} commentId = {this.props.data.commentId} type = {'reply'} Toggle = {() => this.repliesToggle(true)}/><br/></div>
                    : null
                }
                {this.state.showReplies ? 
                    (
                        <Replies commentId = {this.props.data.commentId} questId = {this.props.questId} addReply = {this.state.addReply}/>
                    )    
                    : null
                }
                <hr/>
            </div>
        )
    }
}

Comnt.contextType = FirebaseContext
export default Comnt; 