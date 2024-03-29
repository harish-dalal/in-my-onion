import React , {Component} from 'react'
import  { FirebaseContext } from '../API/firebase'
import firebase from 'firebase'
import './addquest.css'

class Addquest extends Component{
    constructor(){
        super()
        this.state = {
            classNameHidden : true ,
            addOnSuccess : false,
            userCanSubmit : false,
            explicitButtonDisable : true,
            user : {},
            Quest : {
                title : "",
                options : ['',''],
                upvotes : 0,
                downvotes : 0,
                isAnonymous : false,
                tags : [],
                comments : 0,
                settingQuest : false,
            },
            totalAnswers : 0,
        }
        this.updateInput = this.updateInput.bind(this)
        this.updateInputArray = this.updateInputArray.bind(this)
        this.addquestion = this.addquestion.bind(this)
        this.updateInputArrayOptions = this.updateInputArrayOptions.bind(this)
        this.changeStateIsAnonyomus = this.changeStateIsAnonyomus.bind(this)
    }

    updateInput(event){
        const name = event.target.name
        const value = event.target.value;   
        this.setState((prevState)=>({Quest : {...prevState.Quest , ...{[name] : value}}}));
    }

    updateInputArray(event){
        const name = event.target.name;
        const value = event.target.value.split(', ');
        this.setState((prevState)=>({ Quest : {...prevState.Quest , ...{[name] : value}}} ));
    }

    updateInputArrayOptions(index , event){
        const value = event.target.value
        let option = this.state.Quest.options
        option[index] = value
        this.setState((prevState)=>({ 
            Quest : {...prevState.Quest , ...{options : option 
        }}} ));

    }

    addOptionFromButton(){
        let option = this.state.Quest.options
        if(option.length >= 5) return;
        option.push('')
        this.setState(prevState=>({Quest : {...prevState.Quest , ...{options : option}}}))
    }

    removeOptionFromButton(index){
        let option = this.state.Quest.options
        if(option.length < 3) return;
        option.splice(index , 1);
        this.setState(prevState =>({Quest : {...prevState.Quest , ...{options : option}}}))
    }

    addquestion(event){
        event.preventDefault()
        if(!((this.state.Quest.options.length<6 && this.state.Quest.options.every(op=> {return op.trim().length > 0}))&& this.state.Quest.title.trim().length && this.state.explicitButtonDisable)) return;
        if(this.state.user === null) return;
        this.setState({explicitButtonDisable : false , settingQuest : true})
        this.context.db.collection('Quest')
        .add({...this.state.Quest , ...{totalAnswers : this.state.totalAnswers} , ...{timeStamp : firebase.firestore.Timestamp.now()} , ...{user : {userId : this.state.Quest.isAnonymous ? 'Anon' : this.state.user.uid, userName : this.state.Quest.isAnonymous ? 'Anon' : this.state.user.displayName, userProfilePicUrl : this.state.Quest.isAnonymous ? 'Anon' : this.state.user.photoURL}} , ...{totalComments : 0}})
        .then((snap)=>{
            let batch = this.context.db.batch()

            let ansref = this.context.db.collection('Quest').doc(snap.id).collection('quest_data').doc('ans' + snap.id)
            let userpvtref = this.context.db.collection('Users_pvt_data').doc(this.state.user.uid).collection('Quest').doc(`Quest_${this.state.user.uid}`)

            batch.set(ansref , {...{totalAnswers : this.state.totalAnswers} ,...{answers : new Array(this.state.Quest.options.length).fill(0)},
                ...{male : new Array(this.state.Quest.options.length).fill(0)},
                ...{female : new Array(this.state.Quest.options.length).fill(0)} , ...{quest_id : snap.id} , ...{users : {}}})
            
            batch.set(userpvtref , {quest : {[snap.id] : firebase.firestore.Timestamp.now()}} , {merge : true})

            batch.commit()
            .then(()=> {
                console.log('success')
                this.setState({Quest : {title : "" , options : ['','']} , ...{addOnSuccess : true} , explicitButtonDisable : true , settingQuest : false})
            })
            .catch(error=> console.log('error in answers ans pvt data' + error))
        })
        .catch(error=> console.log('error in submitting ' + error));
    }

    openSelectMenu(){
        this.setState(prevState=>({classNameHidden : !prevState.classNameHidden}))
    }

    changeStateIsAnonyomus(value){
        this.setState(prevState=>({Quest : {...prevState.Quest , ...{isAnonymous : value} } , ...{classNameHidden : true}}))
    }

    okaySuccess(){
        this.setState({addOnSuccess : false})
    }

    componentDidMount(){
        this.unsubscribeAuth = this.context.auth.onAuthStateChanged(u=>{
            if(u!=null) this.setState({user :  u});
            else this.setState({user : null});
        })
    }

    componentWillUnmount(){
        if(this.state.user) this.unsubscribeAuth()
    }

    render(){
        return(
            <div className = 'add-question'>
                
                <div className = {(this.state.addOnSuccess ? '' : 'hidden') +' success-add-question noselect'}>
                        <p>question submitted successfully</p>
                        <div className = 'okay-success-prompt' onClick = {this.okaySuccess.bind(this)}>
                            OK
                        </div>
                </div>
                <div className = {(this.state.settingQuest ? '' : 'hidden') +' setting-answer noselect'}>
                        <p>Wait your quest is getting planted...</p>
                        <div className = 'onion-image'/>
                </div>
                <h2>
                    Add question
                </h2>
                <form onSubmit = {this.addquestion}>
                        <div className= 'box-state-change'>
                        <button className='button-state-change' type = 'button' onClick={this.openSelectMenu.bind(this)}>{this.state.Quest.isAnonymous ? 'Anonymous' : 'Public'}
                        <svg width="15px" height="15px" viewBox="0 0 24 24"><g className="icon_svg-stroke"><polyline className = {this.state.classNameHidden ? '' : 'transform-arrow'} points="5 8.5 12 15.5 19.0048307 8.5"></polyline></g></svg>
                        </button>
                        <div className = {'menu-box ' + (this.state.classNameHidden ? 'hidden' : '')} >
                            <div className='menu-box-option' onClick={() =>this.changeStateIsAnonyomus(false)}>
                                <h3>Public</h3>
                                <p>display your name and profile image</p>
                            </div><hr/>
                            <div className='menu-box-option' onClick={() => this.changeStateIsAnonyomus(true)}>
                                <h3>Anonymous</h3>
                                <p>you will be Anonymous and nothing is revealed</p>
                            </div>
                        </div>
                    </div>
                    <textarea className='question-input' type='text' placeholder='question' name='title' value={this.state.Quest.title} onChange={this.updateInput}/><br/>
                    <div className = 'options-box-add'>
                        {
                            this.state.Quest.options.map((op , index)=>{
                                return <div key = {index} className = 'option-and-remove'><textarea required={true} value = {this.state.Quest.options[index]} className='option-input' type='text' placeholder = {`option ${index+1}`} name='options' onChange={(e)=>this.updateInputArrayOptions(index , e)}/>
                                    <button type='button' className = 'remove-option-button' onClick = {()=>this.removeOptionFromButton(index)}>-</button>
                                </div>
                            })
                        }
                        <button type = 'button' className='add-option-button' onClick={() => this.addOptionFromButton()}> + </button>
                    </div><br/><br/>
                    
                    <textarea className='tags-input' type='text' placeholder ='tags (seperated by comma) tag1, tag2' name='tags' onChange={this.updateInputArray}/><br/>
                    {
                        this.state.user?
                        <button className={'submit-button'} disabled={!((this.state.Quest.options.length<6 && this.state.Quest.options.every(op=> {return op.trim().length > 0}))&& this.state.Quest.title.trim().length && this.state.explicitButtonDisable)} type = 'submit'>Submit</button>
                        :<p style = {{margin : 0}}>Sign in to ask</p>
                    }
                </form>
            </div>
        )
    }
}

Addquest.contextType = FirebaseContext

export default Addquest