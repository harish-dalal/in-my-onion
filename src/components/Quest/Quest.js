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
import {WhatsappShareButton, FacebookShareButton, LinkedinShareButton, WhatsappIcon, FacebookIcon, LinkedinIcon} from 'react-share'

class Quest extends Component{
    constructor(props){
        super(props)
        //props =>  data(quest data) , signed(bool) , key(questId) , bookmarked(bool) , forbookmarktab-function , removeQuet from myQuest
        this.state = {
            showAnswer : false,
            viewAnswer : false,
            showComments : false,
            index : -1,
            addComment : false,
            copySuccess : false,
            upVoted : false,
            downVoted : false,
            settingAns : false,
            shareDrop : false,
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
        this.noResponse = this.noResponse.bind(this)
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

    shareDropToggle(){
        this.setState(prevState=>({shareDrop : !prevState.shareDrop , copySuccess : false}))
    }

    copyToClipboard = (e) => {
        this.textArea.select();
        document.execCommand('copy');
        // This is just personal preference.
        // I prefer to not show the the whole text area selected.
        e.target.focus();
        this.setState({ copySuccess: true });
    };

    ansClicked(ind){
        if(ind === this.state.index) return;
        
        this.setState({settingAns : true})
        
        let ref = this.context.db.collection('Quest').doc(this.props.data.questId)
                    .collection('quest_data').doc('ans' + this.props.data.questId)
        
        let questRef = this.context.db.collection('Quest').doc(this.props.data.questId)
        
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
                trans.set(questRef , {totalAnswers : totatAns} , {merge : true})
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

    noResponse(user){
        if(user){
            alert(`verify your account ${user.email}`)
        }
        else alert('sign in for answering')
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
                if(this.props.signed && this.context.auth.currentUser){
                    user = this.context.auth.currentUser.uid
                    if(lenData!==0) if(data.hasOwnProperty(user)) this.setState({upVoted : false , downVoted : true})
                }
                this.setState({downVote : lenData})
            }
        })
    }

    removeQuest(questid){
        let batch = this.context.db.batch()
        let questRef =  this.context.db.collection('Quest').doc(questid);
        let userQuestRef = this.context.db.collection('Users_pvt_data').doc(this.context.auth.currentUser.uid).collection('Quest').doc(`Quest_${this.context.auth.currentUser.uid}`)
        
        batch.delete(questRef);
        batch.set(userQuestRef , {
            quest : {[questid] : firebase.firestore.FieldValue.delete()}
        }, {merge : true})

        batch.commit().then(()=>this.props.reloadFunc()).catch(err=>console.log('error in removing '+err))
    }

    componentDidMount(){
        if(this.props.signed){
            //users signs in getanswer is called no matter whether verified or not for answering would required to verify
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
                <div className = {`share-drop  ${this.state.shareDrop ? '' : 'nodisplay'}`}>
                    <div className = 'share-box'>
                        <div style={{display:'flex' , flexDirection : 'row' , justifyContent : 'space-between' , alignItems : 'center' , color : '#666'}}>
                            <span>Share</span>
                            <span><svg className = 'svg-icons' onClick = {this.shareDropToggle.bind(this)} viewBox="0 0 24 24"><g className='icon-svg'><path d="M12,6 L12,18" transform="translate(12.000000, 12.000000) rotate(45.000000) translate(-12.000000, -12.000000) "></path><path d="M18,12 L6,12" transform="translate(12.000000, 12.000000) rotate(45.000000) translate(-12.000000, -12.000000) "></path></g></svg></span>
                        </div>
                    <div style = {{display : 'flex' , flexDirection : 'row' , justifyContent : 'space-evenly'}}>
                        <WhatsappShareButton url = {window.location.origin + '/Quest/' + this.props.data.questId}>
                            <WhatsappIcon size={40} round={true}/>
                        </WhatsappShareButton>
                        <FacebookShareButton url = {window.location.origin + '/Quest/' + this.props.data.questId}>
                            <FacebookIcon size={40} round={true}/>
                        </FacebookShareButton>
                        <LinkedinShareButton url = {window.location.origin + '/Quest/' + this.props.data.questId}>
                            <LinkedinIcon size={40} round={true}/>
                        </LinkedinShareButton>
                    </div>
                    <div style = {{display:'flex' , flexDirection:'row' , marginTop : '15px'}}><form style = {{width : '100%' , position:'relative'}}>
                        <textarea
                            readOnly = {true}
                            className = 'text-area-share-box'
                            ref={(textarea) => this.textArea = textarea}
                            value={window.location.origin + '/Quest/' + this.props.data.questId}
                        />
                        <button onClick={this.copyToClipboard.bind(this)} className = 'share-copy-button' type = 'button'><svg className = 'svg-icons' viewBox="-66 0 569 569.286"><g className = 'share-button-path'><path d="m.109375 66.382812v493.132813c0 5.238281 4.246094 9.484375 9.484375 9.484375h360.367188c5.234374 0 9.480468-4.246094 9.480468-9.484375v-398.296875c0-.210938-.101562-.390625-.121094-.597656-.046874-.832032-.210937-1.652344-.484374-2.4375-.105469-.304688-.179688-.597656-.3125-.894532-.460938-1.03125-1.101563-1.972656-1.898438-2.777343l-94.832031-94.832031c-.804688-.800782-1.75-1.441407-2.789063-1.898438-.285156-.121094-.574218-.222656-.871094-.3125-.792968-.273438-1.617187-.4375-2.457031-.492188-.160156.027344-.347656-.074218-.546875-.074218h-265.535156c-5.238281 0-9.484375 4.242187-9.484375 9.480468zm346.957031 85.351563h-62.457031v-62.457031zm-327.992187-75.867187h246.570312v85.351562c0 5.234375 4.246094 9.480469 9.480469 9.480469h85.351562v379.335937h-341.402343zm0 0"/><path d="m75.976562 189.667969h227.597657v18.964843h-227.597657zm0 0"/><path d="m75.976562 132.765625h75.867188v18.96875h-75.867188zm0 0"/><path d="m75.976562 246.566406h151.734376v18.96875h-151.734376zm0 0"/><path d="m246.675781 246.566406h56.898438v18.96875h-56.898438zm0 0"/><path d="m75.976562 303.464844h227.597657v18.96875h-227.597657zm0 0"/><path d="m75.976562 417.265625h227.597657v18.96875h-227.597657zm0 0"/><path d="m161.324219 360.367188h142.25v18.964843h-142.25zm0 0"/><path d="m75.976562 360.367188h66.382813v18.964843h-66.382813zm0 0"/><path d="m75.976562 474.167969h37.933594v18.964843h-37.933594zm0 0"/><path d="m132.875 474.167969h170.699219v18.964843h-170.699219zm0 0"/></g></svg></button>
                    </form></div>
                    <div style = {{marginTop : '5px' ,textAlign : 'end', color : 'grey' }}>{`${this.state.copySuccess ? 'copied!' : ' '}`}</div>
                    </div>
                </div>
                <div className = 'profile-box'>
                    <div style ={{height:'35px' , width:'35px'}}><Profile imageUrl = {this.props.data.isAnonymous ? null : this.props.data.user.userProfilePicUrl}/></div>
                    <div style= {{display : 'flex' , flexDirection : 'column'}}>
                        <p>{this.props.data.isAnonymous ? 'Anonymous' : this.props.data.user.userName}</p>
                        <span style = {{display:'flex' , flexDirection : 'row'}}><p className = 'date'><span>&#183;</span>{' ' + Date[2] + ' ' + Date[1] + ' ' + Date[3] }</p><p className ='date'><span>&#183;</span>{' '+this.props.data.totalAnswers + ' Voted'}</p></span>
                    </div>
                </div>
                <h3>{this.props.data.title}</h3>

                {this.props.data.options.map((on , index) => {
                    return(<Onion signed = {this.props.signed} onion = {on} ind = {index} key = {index} ans = {this.props.signed ? this.state.index : -1} allAns = {(this.state.viewAnswer && this.props.signed) ? this.state.questData : this.constQuestData} setOnion = {this.props.signed&&this.context.auth.currentUser.emailVerified ? this.ansClicked.bind(this) : this.state.signed && this.context.auth.currentUser.emailVerified ? ()=>this.noResponse(null) : ()=>this.noResponse(this.context.auth.currentUser)}/>)
                })}


                <div className = 'up-down'>
                    <svg className='svg-icons noselect' onClick={() =>this.vote.upVote('Quest' , this.props.signed ? this.context.auth.currentUser.uid : null , this.props.data.questId)} viewBox="0 0 24 24"><g id="upvote" className={'icon-svg'+ (this.props.signed && this.state.upVoted ? ' upvoted' : '')}><polygon points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon></g></svg>
                    <p>{this.state.upVote - this.state.downVote}</p>
                    <svg className='svg-icons noselect' onClick={() =>this.vote.downVote('Quest' , this.props.signed ? this.context.auth.currentUser.uid : null , this.props.data.questId)} viewBox="0 0 24 24"><g id="downvote" className={'icon-svg' + (this.props.signed && this.state.downVoted ? ' downvoted' : '')}><polygon transform="translate(12.000000, 12.000000) rotate(-180.000000) translate(-12.000000, -12.000000) " points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon></g></svg>
                    <div className = 'view-answer noselect' onClick = {this.answerToggle.bind(this)}>{this.state.viewAnswer ? 'Hide Onions' : 'View Onions'}</div>
                    <svg id='share' className = {`svg-icons noselect`} style = {{marginLeft:'auto'}} onClick = {this.shareDropToggle.bind(this)} viewBox="0 0 24 24"><g className = 'icon-svg'><path d="M12.0001053,2.99989467 L4.00010533,12.7776724 L9.33343867,12.7776724 C9.78266695,14.7041066 10.5048892,16.2782509 11.5001053,17.5001053 C12.4953215,18.7219597 13.9953215,19.8886264 16.0001053,21.0001053 C15.3415908,19.6668553 14.8428108,18.1668553 14.5037654,16.5001053 C14.16472,14.8333553 14.2190556,13.5925444 14.666772,12.7776724 L20.0001053,12.7776724 L12.0001053,2.99989467 Z" transform="translate(12.000105, 12.000000) rotate(90.000000) translate(-12.000105, -12.000000) "></path></g></svg>
                </div>

                <div style = {{display : 'flex' , flexDirection : 'row'}}><div className = "comment-link noselect" onClick = {()=>this.commentToggle(false)}>
                    {this.state.showComments ? 'Hide ': 'Show '}{this.props.data.totalComments} comments
                </div>
                <div className = {'add-comment noselect'} onClick = {this.addCommentToggle.bind(this)}>Comment</div></div>
                {this.state.addComment ?
                    <div><AddComment questId = {this.props.data.questId} type = {'comment'}  Toggle = {() => this.commentToggle(true)}/><br/></div>
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