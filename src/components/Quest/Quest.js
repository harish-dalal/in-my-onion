import React , {Component} from 'react'
import Onion from './Onion'
import Comments from '../cmtsAndRpls/comments/Comments'
import Profile from '../profilePic/ProfilePic'
import AddComment from '../cmtsAndRpls/AddComment'
import './quest.css'
import { FirebaseContext } from '../API/firebase'

class Quest extends Component{
    constructor(props){
        super(props)
        //props =>  data(quest data) , signed(bool) , key(questId)
        this.state = {
            showAnswer : false,
            viewAnswer : false,
            showComments : false,
            index : -1,
            addComment : false,
            questData : {
                answers : [],
                male : [],
                female : [],
                totalAnswers : 0,
            },
            comments : [
                'cmt1' , "commt2" , "cmont3"
            ]
        }
        this.constQuestData = {
            answers : [],
            male : [],
            female : [],
            totalAnswers : 0,
        }
    }

    commentToggle(){
        this.setState((prevState)=>({
            showComments : !prevState.showComments
        }))
    }

    answerToggle(){
        // if(!this.props.signed){
        //     console.log('sign in prompt')
        // }
        // else{
            this.setState(prevState => ({
                viewAnswer : !prevState.viewAnswer
            }))
        // }
    }

    addCommentToggle(){
        this.setState(prevState =>({addComment : !prevState.addComment}))
    }

    ansClicked(ind){
        if(ind === this.state.index) return;
        

        let ref = this.context.db.collection('Quest').doc(this.props.data.questId)
                    .collection('quest_data').doc('ans' + this.props.data.questId)
        
        console.log('wait...')
        
        return this.context.db.runTransaction(trans=>{
            return trans.get(ref).then(doc=>{
                if(!doc.exists) console.log('doc does not exist')

                let answerArray = doc.data().answers
                let totatAns = doc.data().totalAnswers
                answerArray[ind] += 1;
                if(this.state.index !== -1){
                    answerArray[this.state.index] -= 1;
                }   
                else totatAns += 1;
                let user = this.context.auth.currentUser.uid
                trans.set(ref , {answers : answerArray , totalAnswers : totatAns , users : {[user] : ind} }, {merge : true})
            })
        }).then(()=>console.log('success in transaction done'))
        .catch(error => console.log('error in transaction done ' + error))

    }

    noResponse(ind){
        console.log('sign in for answering')
    }

    getAnswer(){
        const user = (this.context.auth.currentUser.uid)
        this.unsubscribe = this.context.db.collection('Quest').doc(this.props.data.questId)
        .collection('quest_data').doc('ans' + this.props.data.questId)
        .onSnapshot(snap=>{
            const data = snap.data()
            //setting viewanswer according to whether the user has answered or not
            const boolview = data.users[user]!==undefined ? true : false 
            const ind = data.users[user]!==undefined ? data.users[user] : -1
            this.setState({questData  : data , viewAnswer : boolview , index : ind })
        })
    }

    componentDidMount(){
        if(this.props.signed){
            this.getAnswer()
        }
        else{
            this.setState({showAnswer : false , viewAnswer : false , index : -1})
        }
        // console.log(this.state.showAnswer + ' showans ' + this.props.signed)
        
    }

    componentWillUnmount(){
        //this will detach listener to the answers for this question
        this.unsubscribe();
    }

    render(){
        const Date = this.props.data.timeStamp.toDate().toDateString().split(' ')
        return(
            <div className = "quest-box">
                <div className = 'profile-box'>
                    <div style ={{height:'35px' , width:'35px'}}><Profile imageUrl = {this.props.data.isAnonymous ? null : this.props.data.user.userProfilePicUrl}/></div>
                    <div style= {{display : 'flex' , flexDirection : 'column'}}>
                        <p>{this.props.data.isAnonymous ? 'Anonymous' : this.props.data.user.userName}</p>
                        <p className = 'date'><span>&#183;</span>{' ' + Date[2] + ' ' + Date[1] + ' ' + Date[3] }</p>
                    </div>
                </div>
                <h3>{this.props.data.title}</h3>

                {this.props.data.options.map((on , index) => {
                    return(<Onion onion = {on} ind = {index} key = {index} ans = {this.props.signed ? this.state.index : -1} allAns = {(this.state.viewAnswer && this.props.signed) ? this.state.questData : this.constQuestData} setOnion = {this.props.signed ? this.ansClicked.bind(this) : this.noResponse.bind(this)}/>)
                })}


                <div className = 'up-down'>
                    <svg width="24px" height="24px" viewBox="0 0 24 24"><g id="upvote" className="icon_svg-stroke icon_svg-fill" strokeWidth="1.5" stroke="#666" fill="none" fillRule="evenodd" strokeLinejoin="round"><polygon points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon></g></svg>
                    <p>{this.props.data.upvotes - this.props.data.downvotes}</p>
                    <svg width="24px" height="24px" viewBox="0 0 24 24"><g id="downvote" className="icon_svg-stroke icon_svg-fill" stroke="#666" fill="none" strokeWidth="1.5" fillRule="evenodd" strokeLinejoin="round"><polygon transform="translate(12.000000, 12.000000) rotate(-180.000000) translate(-12.000000, -12.000000) " points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon></g></svg>
                    <div className = 'view-answer noselect' onClick = {this.answerToggle.bind(this)}>{this.state.viewAnswer ? 'Hide Onions' : 'View Onions'}</div>
                </div>

                <div style = {{display : 'flex' , flexDirection : 'row'}}><div className = "comment-link noselect" onClick = {this.commentToggle.bind(this)}>
                    {this.state.showComments ? 'Hide ': 'Show '}{this.props.data.totalComments} comments
                </div>
                <div className = 'add-comment noselect' onClick = {this.addCommentToggle.bind(this)}>Comment</div></div>

                {this.state.addComment ?
                    <div><AddComment questId = {this.props.data.questId} type = {'comment'}/><br/></div>
                    : null
                }
                {this.state.showComments ? 
                    (
                        <Comments questId = {this.props.data.questId}/>
                    )    
                    : null
                }
            </div>
        )
    }
}
Quest.contextType = FirebaseContext

export default Quest;