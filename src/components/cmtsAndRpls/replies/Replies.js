import React , {Component} from 'react'
import { FirebaseContext } from '../../API/firebase'
import Reply from './Reply'
import './replies.css'

class Replies extends Component{
    constructor(props){
        super(props)
        // props => questId , commentId
        this.state = {
            userReplies : [],
            replies : [],
            isSignedIn : false,
            user : {},
            loadingDiv : false,
        }
    }

    componentDidMount(){
        //fetch comments from server
        const ref = this.context.db.collection('Quest').doc(this.props.questId)
        .collection('Comments').doc(this.props.commentId)
        .collection('Replies')

        this.unsubscribe = ref.onSnapshot(snap=>{
            let data = []
            let userdata = []
            snap.docs.forEach(doc=>{
                // return({...doc.data() , ...{replyId : doc.id}})
                if(this.context.auth.currentUser && doc.data().user.userId === this.context.auth.currentUser.uid){
                    userdata.push({...doc.data() , ...{replyId : doc.id}})
                }
                else {
                    data.push({...doc.data() , ...{replyId : doc.id}})
                }
            })
            this.setState({...{replies : data} , ...{userReplies : userdata} , ...{loadingDiv : false}})
        })

        this.unsubscribeAuthChange = this.context.auth.onAuthStateChanged(usr=>{
            if(usr!=null) {
                this.setState({isSignedIn :  true , user : usr});
            }
            else {
                this.setState({isSignedIn : false , user : usr});
            }
        })
    }

    componentWillUnmount(){
        this.unsubscribe()
    }

    render(){
        return(
            this.state.loadingDiv ?
            <div style ={{width : '100%' , textAlign : 'center'}}>Loading...</div>
            :<div>
                <div className = 'single-reply-box'>
                    {
                        this.state.userReplies.map(reply=>{
                            return (<Reply data = {reply} key={reply.replyId} questId = {this.props.questId} commentId = {this.props.commentId} signed = {this.state.isSignedIn}/>)
                        })
                    }
                    {
                        this.state.replies.map(reply=>{
                            return (<Reply data = {reply} key={reply.replyId} questId = {this.props.questId} commentId = {this.props.commentId} signed = {this.state.isSignedIn}/>)
                        })
                    }
                </div>
            </div>
        )
    }

}

Replies.contextType = FirebaseContext
export default Replies