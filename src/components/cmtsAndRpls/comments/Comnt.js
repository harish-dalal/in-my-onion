import React , { Component } from 'react'
import { FirebaseContext } from '../../API/firebase'
import firebase from 'firebase'
import Profile from '../../profilePic/ProfilePic'
import Replies from '../replies/Replies'
import AddComment from '../AddComment'
import './comnt.css'

class Comnt extends Component{
    constructor(props){
        super(props)
        // props => data(comment data) , questId , key(commentId)
        this.state = {
            user : {},
            showReplies : false,
            addReply : false,
        }
    }

    repliesToggle(){
        this.setState(prevState=>({showReplies : !prevState.showReplies}))
    }

    addReplyToggle(){
        this.setState(prevState=>({addReply : !prevState.addReply}))
    }

    componentDidMount(){
        this.context.auth.onAuthStateChanged(u=>{
            if(u!=null) this.setState({user :  u});
            else this.setState({user : null});
        })
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
                <div className = 'up-down-comment'>
                    <svg width="20px" height="20px" viewBox="0 0 24 24"><g id="upvote" className="icon_svg-stroke icon_svg-fill" strokeWidth="1.5" stroke="#666" fill="none" fillRule="evenodd" strokeLinejoin="round"><polygon points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon></g></svg>
                    <p>23</p>
                    <svg width="20px" height="20px" viewBox="0 0 24 24"><g id="downvote" className="icon_svg-stroke icon_svg-fill" stroke="#666" fill="none" strokeWidth="1.5" fillRule="evenodd" strokeLinejoin="round"><polygon transform="translate(12.000000, 12.000000) rotate(-180.000000) translate(-12.000000, -12.000000) " points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon></g></svg>
                    <div className = 'view-replies noselect' onClick = {this.repliesToggle.bind(this)}>{this.state.showReplies ? 'Hide ' : 'View '}{this.props.data.totalReplies} replies</div>
                    <div className = 'reply noselect' onClick = {this.addReplyToggle.bind(this)}>Reply</div>
                </div>
                
                {this.state.addReply ?
                    <div><AddComment questId = {this.props.questId} commentId = {this.props.data.commentId} type = {'reply'}/><br/></div>
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