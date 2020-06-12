import React , {Component} from 'react'
import {FirebaseContext} from '../API/firebase'
import firebase from "firebase";
import './addcomment.css'


class AddComment extends Component{
    constructor(props){
        super(props)
        //props => questId , commentId , type(comment or reply)
        this.state = {
            text : "",
            isAnonymous : false,
            user : {},
        }
        this.handleChange = this.handleChange.bind(this)
    }

    submitComment(event){
        event.preventDefault()
        if(this.state.text === '') return;
        console.log('submitting ' + this.props.type)
        
        let batch = this.context.db.batch()

        let ref = this.context.db.collection('Quest').doc(this.props.questId).collection('Comments')
        
        if(this.props.type === 'reply') ref = ref.doc(this.props.commentId).collection('Replies')
        
        ref = ref.doc()
        
        batch.set(ref , {
            ...{user : {
                userId : this.state.user.uid,
                userName : this.state.user.displayName,
                userProfilePicUrl : this.state.user.photoURL,
            }},
            ...{timeStamp : firebase.firestore.Timestamp.now(),
                upVotes : 0,
                downVotes : 0,
                questId : this.props.questId,
                [this.props.type] : this.state.text,
                isAnonymous : false},
            ...(this.props.type === 'reply' && {commentId : this.props.commentId}),
            ...(this.props.type === 'comment' && {totalReplies : 0}),

        })
        let increament = firebase.firestore.FieldValue.increment(1)
        let incRef = this.context.db.collection('Quest').doc(this.props.questId)
        if(this.props.type === 'reply') incRef = incRef.collection('Comments').doc(this.props.commentId)
        batch.update(incRef , {
            ...(this.props.type === 'comment' ? {totalComments : increament} : {totalReplies : increament})
        })

        batch.commit().then(()=>{
            if(this.props.type === 'comments') this.props.commentToggle()
            console.log('increamented and added')
            this.setState({text : ''})
        })
        .catch(err=>console.log('error ' + err))
    }

    handleChange(event){
        const value = event.target.value;
        this.setState({text : value})
    }

    componentDidMount(){
        this.context.auth.onAuthStateChanged(u=>{
            if(u!=null) this.setState({user :  u});
            else this.setState({user : null});
        })
    }

    render(){ 
        return(
            <form onSubmit = {this.submitComment.bind(this)}>
                {
                    this.state.user ?
                    (<div className = 'add-input'><input className = {'text-input ' + this.props.type + '-input'} type='textarea' placeholder={'Add public ' + this.props.type} value={this.state.text} onChange = {this.handleChange}/>
                    <button className = {this.state.text.trim().length ? 'comment-submit' : 'comment-submit-disabled'} type = 'submit' style={this.props.type === 'reply' ?{width : '20%'} : {width : 'auto'}} >{this.props.type.toUpperCase()}</button></div>)
                    :<p>{'Sign in for ' + this.props.type }</p>
                }
            </form>
        )
    }
}

AddComment.contextType = FirebaseContext
export default AddComment;