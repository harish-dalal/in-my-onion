import React , {Component} from 'react'
import {FirebaseContext} from '../API/firebase'
import firebase from "firebase";


class AddComment extends Component{
    constructor(props){
        super(props)
        this.state = {
            commment : "",
            isAnonymous : false,
            user : {},
        }
        this.handleChange = this.handleChange.bind(this)
    }

    submitComment(event){
        event.preventDefault()
        console.log('submitting comment')
        const ref = this.context.db.collection('Quest').doc(this.props.questId).collection('Comments').doc()
        
        ref.set({
            ...{user : {
                userId : this.state.user.uid,
                userName : this.state.user.displayName,
                userProfilePicUrl : this.state.user.photoURL,
            }},
            ...{timeStamp : firebase.firestore.Timestamp.now(),
                upVotes : 0,
                downVotes : 0,
                questId : this.props.questId,
                comment : this.state.commment,
                isAnonymous : false},

        }).then(()=>console.log('comment added successfully'))
        .catch(error=>console.log('error in adding comment ' + error))
        this.setState({commment : ""})
    }

    handleChange(event){
        const value = event.target.value;
        this.setState({commment : value})
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
                <input type='textarea' placeholder='Add Comment' value={this.state.commment} onChange = {this.handleChange}/>
                <button type = 'submit'>submit</button>
            </form>
        )
    }
}

AddComment.contextType = FirebaseContext
export default AddComment;