import React , {Component} from 'react'
import Onion from './Onion'
import firebase from 'firebase'
import Comments from '../cmtsAndRpls/comments/Comments'
import Profile from '../profilePic/ProfilePic'
import AddComment from '../cmtsAndRpls/AddComment'
import './quest.css'
import { FirebaseContext } from '../API/firebase'
import Vote from '../helper/vote'
import bookmark from '../helper/bookmark' 
import Bookmark from '../../resources/Bookmark'

class Quest extends Component{
    constructor(props){
        super(props)
        //props =>  data(quest data) , signed(bool) , key(questId) , bookmarked(bool) , forbookmarktab-function
        this.state = {
            showAnswer : false,
            viewAnswer : false,
            showComments : false,
            index : -1,
            addComment : false,
            upVoted : false,
            downVoted : false,
            settingAns : false,
            upVote : 0,
            downVote : 0,
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
        
        this.commentToggle = this.commentToggle.bind(this)
        this.vote = new Vote(this.context)
        this.bookmark = new bookmark(this.context)
    }

    commentToggle(value){
        this.setState((prevState)=>({
            showComments : (!prevState.showComments || value)
        }))
    }

    answerToggle(){
            if(!this.props.signed) {
                this.setState({viewAnswer : false})
                alert('sign in to view answers')
                return
            }
            this.setState(prevState => ({
                viewAnswer : !prevState.viewAnswer
            }))
    }

    addCommentToggle(){
        this.setState(prevState =>({addComment : !prevState.addComment}))
    }

    ansClicked(ind){
        if(ind === this.state.index) return;
        
        this.setState({settingAns : true})
        
        let ref = this.context.db.collection('Quest').doc(this.props.data.questId)
                    .collection('quest_data').doc('ans' + this.props.data.questId)
        
        
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
        }).then(()=>{
            console.log('success in transaction done')
            this.setState({settingAns : false})
        }).catch(error =>{ 
            console.log('error in transaction done ' + error)
            this.setState({settingAns : false})
            alert('try again later')
        })

    }

    noResponse(ind){
        alert('sign in for answering')
    }

    getAnswer(){
        //getting answer snapshot
        const user = (this.context.auth.currentUser.uid)
        this.unsubscribeAns = this.context.db.collection('Quest').doc(this.props.data.questId)
        .collection('quest_data').doc('ans' + this.props.data.questId)
        .onSnapshot(snap=>{
            const data = snap.data()
            //setting viewanswer according to whether the user has answered or not
            const boolview = data.users[user]!==undefined ? true : false 
            const ind = data.users[user]!==undefined ? data.users[user] : -1
            this.setState({questData  : data , viewAnswer : boolview , index : ind })
        })

        //getting bookmarks as well
    }

    getVotes(){
        //getting upvotes snapshot
        //Todo to remove the conditoin tot check the user value inside OBkectjs.keys
        this.unsubscribeUp = this.context.db.collection('Quest_data').doc(this.props.data.questId).collection('upVotes').doc(`upVote_${this.props.data.questId}`)
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
        this.unsubscribedown = this.context.db.collection('Quest_data').doc(this.props.data.questId).collection('downVotes').doc(`downVote_${this.props.data.questId}`)
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

    removeQuest(questid){
        console.log(`remove ${questid}`)
        let batch = this.context.db.batch()
        let questRef =  this.context.db.collection('Quest').doc(questid);
        let userQuestRef = this.context.db.collection('Users_pvt_data').doc(this.context.auth.currentUser.uid).collection('Quest').doc(`Quest_${this.context.auth.currentUser.uid}`)
        
        batch.delete(questRef);
        batch.set(userQuestRef , {
            quest : {[questid] : firebase.firestore.FieldValue.delete()}
        }, {merge : true})

        batch.commit().then(()=>window.location.reload()).catch(err=>console.log('error in removing '+err))
    }

    componentDidMount(){
        if(this.props.signed){
            this.getAnswer()
        }
        else{
            this.setState({showAnswer : false , viewAnswer : false , index : -1 , upVoted : false , downVoted : false})
        }
        this.getVotes()
        this.vote = new Vote(this.context)
        this.bookmark = new bookmark(this.context)
        // console.log(this.state.showAnswer + ' showans ' + this.props.signed)
        
    }

    componentWillUnmount(){
        //this will detach listener to the answers for this question
        if(this.props.signed){
            this.unsubscribeAns();
        }
        // this.unsubscribeAns();
        this.unsubscribeUp();
        this.unsubscribedown();
    }


    render(){
        if(typeof this.props.data.timeStamp === 'undefined') return null
        const Date = this.props.data.timeStamp.toDate().toDateString().split(' ')
        return(
            <div className = "quest-box">
                {this.props.deleteMyQuest && this.props.signed ?
                    <div className = 'remove noselect' onClick={()=>this.removeQuest(this.props.data.questId)}>Remove</div>
                    :null
                }       
                <Bookmark click = {()=>{
                    this.bookmark.setBookmarkToggle(this.props.signed ? this.context.auth.currentUser.uid : null , this.props.data.questId , this.props.bookmarked)
                    this.props.funcForBookMarkTab()
                    }}  bookmarked = {this.props.bookmarked}/>
                <div className = {(this.state.settingAns ? '' : 'hidden') +' setting-answer noselect'}>
                        <p>Wait your onion is getting peeled...</p>
                        <div className = 'onion-image'/>
                </div>
                <div className = 'profile-box'>
                    <div style ={{height:'35px' , width:'35px'}}><Profile imageUrl = {this.props.data.isAnonymous ? null : this.props.data.user.userProfilePicUrl}/></div>
                    <div style= {{display : 'flex' , flexDirection : 'column'}}>
                        <p>{this.props.data.isAnonymous ? 'Anonymous' : this.props.data.user.userName}</p>
                        <span style = {{display:'flex' , flexDirection : 'row'}}><p className = 'date'><span>&#183;</span>{' ' + Date[2] + ' ' + Date[1] + ' ' + Date[3] }</p>{this.props.signed ? <p className ='date'><span>&#183;</span>{' '+this.state.questData.totalAnswers + ' Voted'}</p> : null}</span>
                    </div>
                </div>
                <h3>{this.props.data.title}</h3>

                {this.props.data.options.map((on , index) => {
                    return(<Onion signed = {this.props.signed} onion = {on} ind = {index} key = {index} ans = {this.props.signed ? this.state.index : -1} allAns = {(this.state.viewAnswer && this.props.signed) ? this.state.questData : this.constQuestData} setOnion = {this.props.signed ? this.ansClicked.bind(this) : this.noResponse.bind(this)}/>)
                })}


                <div className = 'up-down'>
                    <svg className='up-down-arrow noselect' onClick={() =>this.vote.upVote('Quest' , this.props.signed ? this.context.auth.currentUser.uid : null , this.props.data.questId)} viewBox="0 0 24 24"><g id="upvote" className={'icon-svg'+ (this.props.signed && this.state.upVoted ? ' upvoted' : '')}><polygon points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon></g></svg>
                    <p>{this.state.upVote - this.state.downVote}</p>
                    <svg className='up-down-arrow noselect' onClick={() =>this.vote.downVote('Quest' , this.props.signed ? this.context.auth.currentUser.uid : null , this.props.data.questId)} viewBox="0 0 24 24"><g id="downvote" className={'icon-svg' + (this.props.signed && this.state.downVoted ? ' downvoted' : '')}><polygon transform="translate(12.000000, 12.000000) rotate(-180.000000) translate(-12.000000, -12.000000) " points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon></g></svg>
                    <div className = 'view-answer noselect' onClick = {this.answerToggle.bind(this)}>{this.state.viewAnswer ? 'Hide Onions' : 'View Onions'}</div>
                </div>

                <div style = {{display : 'flex' , flexDirection : 'row'}}><div className = "comment-link noselect" onClick = {()=>this.commentToggle(false)}>
                    {this.state.showComments ? 'Hide ': 'Show '}{this.props.data.totalComments} comments
                </div>
                <div className = 'add-comment noselect' onClick = {this.addCommentToggle.bind(this)}>Comment</div></div>
                {this.state.addComment ?
                    <div><AddComment questId = {this.props.data.questId} type = {'comment'}  commentToggle = {() => this.commentToggle(true)}/><br/></div>
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