import React , {Component} from 'react'
import  { FirebaseContext } from '../API/firebase'
import firebase from 'firebase'
import './test.css'

class AskQuest extends Component{
    constructor(){
        super()
        this.state = {
            user : {},
            Quest : {
                title : "",
                options : [],
                upvotes : 0,
                downvotes : 0,
                isAnonymous : false,
                tags : [],
                comments : 0,
            },
            totalAnswers : 0,
        }
        this.updateInput = this.updateInput.bind(this)
        this.updateInputArray = this.updateInputArray.bind(this)
        this.addquestion = this.addquestion.bind(this)
        this.updateInputArrayOptions = this.updateInputArrayOptions.bind(this)
    }

    updateInput(event){
        const name = event.target.name
        const value = event.target.value;   
        this.setState((prevState)=>({Quest : {...prevState.Quest , ...{[name] : (value === 'true' ? true : value)}}}));
    }

    updateInputArray(event){
        const name = event.target.name;
        const value = event.target.value.split(', ');
        this.setState((prevState)=>({ Quest : {...prevState.Quest , ...{[name] : value}}} ));
    }

    updateInputArrayOptions(event){
        const name = event.target.name;
        const value = event.target.value.split(', ');
        this.setState((prevState)=>({ 
            Quest : {...prevState.Quest , ...{[name] : value}, 
        }} ));

    }

    addquestion(event){
        event.preventDefault()

        let id;
        this.context.db.collection('Quest')
        .add({...this.state.Quest , ...{timeStamp : firebase.firestore.Timestamp.now()} , ...{user : {userId : this.state.user.uid, userName : this.state.user.displayName, userProfilePicUrl : this.state.user.photoURL}} , ...{totalComments : 0}})
        .then((snap)=>{ 
            this.context.db.collection('Quest').doc(snap.id).collection('quest_data').doc('ans' + snap.id)
            .set({...{totalAnswers : this.state.totalAnswers} ,...{answers : new Array(this.state.Quest.options.length).fill(0)},
                ...{male : new Array(this.state.Quest.options.length).fill(0)},
                ...{female : new Array(this.state.Quest.options.length).fill(0)} , ...{quest_id : snap.id} , ...{users : {}}})
            .then(finalsnap=> console.log('success'))
            .catch(error=> console.log('error in answers' + error))
        })
        .catch(error=> console.log('error in submitting ' + error));
    }

    componentDidMount(){
        this.context.auth.onAuthStateChanged(u=>{
            if(u!=null) this.setState({user :  u});
            else this.setState({user : null});
        })
    }

    render(){
        // console.log(this.state.Quest.options.length)
        let user = this.context.auth.currentUser
        return(
            <div className = 'test'>
            <h1>
                Add question
            </h1>
            <form onSubmit = {this.addquestion}>
                <textarea className='question' type='text' placeholder='question' name='title' onChange={this.updateInput}/><br/>
                <textarea className='tags' type='text' placeholder = "options (seperated by comma)" name='options' onChange={this.updateInputArrayOptions}/><br/><br/>
                <input type='number' placeholder = "upvotes" name='upvotes' onChange={this.updateInput}/><br/>
                <input type='number' placeholder = "downvotes" name='downvotes' onChange={this.updateInput}/><br/>
                {/* <input type='number' placeholder = "shares" name='shares' onChange={this.updateInput}/><br/> */}
                <div><br/>
                    Anonymous    
                    <input type="radio" id="false" name="isAnonymous" value="false" onChange={this.updateInput}/>
                    <label htmlFor="false">False</label>
                    <input type="radio" id="true" name="isAnonymous" value="true" onChange={this.updateInput}/>
                    <label htmlFor="true">True</label>
                </div><br/> 
                <textarea className='tags' type='text' placeholder ='tags' name='tags' onChange={this.updateInputArray}/><br/>
                <input type='text' placeholder = "userId" name='userId' value = {this.state.user ? this.state.user.uid : 'sign in'} onChange={this.updateInput}/><br/>
                <input type='text' placeholder = "userName" name='userName' value = {this.state.user ? this.state.user.displayName : 'sign in'} onChange={this.updateInput}/><br/>
                <input type='text' placeholder = "profileurl" name='profilePicUrl' value = {this.state.user ? this.state.user.photoURL : 'sign in'} onChange={this.updateInput}/><br/><br/>
                <button type = 'submit'>Submit</button>
            </form>
            </div>
        )
    }
}

AskQuest.contextType = FirebaseContext

export default AskQuest